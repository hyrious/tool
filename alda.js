var Alda = (function () {
    function findPairParen(str) {
        for (let i = 1, k = 1; i < str.length; ++i) {
            if (str[i] === '(') k++;
            if (str[i] === ')') k--;
            if (k === 0) return ++i;
        }
    }

    function tokenize(str) {
        let tokens = [], m, l;
        function skipSpace() {
            if (m = str.match(/^\s+/)) {
                if (m[0].includes('\n')) tokens.push({ kind: 'newline', string: '\n' });
                str = str.substring(m[0].length);
            }
        }
        function pushToken(kind) {
            if (!l) l = m[0].length;
            const token = { kind, string: str.substring(0, l) };
            tokens.push(token);
            str = str.substring(l);
            l = 0;
            return token;
        }
        function processDuration() {
            while (true) {
                skipSpace();
                if (m = str.match(/^((\d+)(?:ms|s)|(\d+\.)?\d+\.*)/)) {
                    pushToken('note-length');
                } else if (str.startsWith('|')) {
                    l = 1, pushToken('barline');
                } else if (str.startsWith('~')) {
                    l = 1, pushToken('tie');
                } else {
                    break;
                }
            }
        }
        function simpleToken(c, token) {
            if (str.startsWith(c)) {
                l = c.length, pushToken(token);
                return true;
            }
        }
        while (str) {
            skipSpace();
            if (simpleToken('/', 'slash')) continue;
            if (simpleToken(':', 'colon')) continue;
            if (simpleToken('|', 'barline')) continue;
            if (simpleToken('=', 'equals')) continue;
            if (simpleToken('<', 'octave')) continue;
            if (simpleToken('>', 'octave')) continue;
            if (simpleToken('{', 'cram-open')) continue;
            if (simpleToken('}', 'cram-close')) { processDuration(); continue; }
            if (simpleToken('[', 'event-seq-open')) continue;
            if (simpleToken(']', 'event-seq-close')) continue;
            // (tempo! 80)
            if (str.startsWith('(')) {
                if (!(l = findPairParen(str)))
                    throw new Error('Failed to parse inline expr, mismatched (');
                pushToken('inline');
                continue;
            }
            // # comment
            if (m = str.match(/^#.*/)) {
                pushToken('comment');
                continue;
            }
            // V123:
            if (m = str.match(/^V(\d+):/)) {
                pushToken('voice').value = +m[1];
                continue;
            }
            // o4:
            if (m = str.match(/^o(-?\d+)/)) {
                pushToken('octave').value = +m[1];
                continue;
            }
            // %marker
            if (m = str.match(/^%([\w\-]+)/)) {
                pushToken('marker').value = m[1];
                continue;
            }
            // @marker
            if (m = str.match(/^@([\w\-]+)/)) {
                pushToken('at-marker').value = m[1];
                continue;
            }
            // c4
            if (str.match(/^[cdefgab]([# \n\+\-\_\/\~\*\'\}\]\<\>\d\|]|$)/)) {
                l = 1, pushToken('note');
                if (m = str.match(/^[\+\-\_]+/)) {
                    pushToken('accidentals');
                }
                processDuration();
                continue;
            }
            // r1
            if (str.match(/^r([# \n\/\~\*\}\]\<\>\d]|$)/)) {
                l = 1, pushToken('rest');
                processDuration();
                continue;
            }
            // variable name/instrument call
            if (m = str.match(/^[a-zA-Z]{2}[\w\-\.]*/)) {
                pushToken('name');
                continue;
            }
            // "nickname"
            if (m = str.match(/^"([\w\-]*)"/)) {
                pushToken('nickname').value = m[1];
                continue;
            }
            // *4
            if (m = str.match(/^\*\s*(\d+)/)) {
                pushToken('repeat').value = +m[1];
                continue;
            }
            // '4
            if (m = str.match(/^\'\s*([ \d\-\,]+)/)) {
                pushToken('repeat-num').value = m[1];
                continue;
            }
            skipSpace();
            // done
            if (!str) break;
            // otherwise, fail
            throw new Error('Failed to parse, rest str = "' + str + '"');
        }
        return tokens;
    }

    function parse(str) {
        let tokens = tokenize(str).filter(token =>
            !(token.kind === 'comment' || token.kind === 'barline'));
        let token, stack = [], temp;
        function pushToken() {
            const event = { kind: token.kind };
            if (token.value) event.value = token.value;
            stack.push(event);
            return event;
        }
        function peek(...kinds) {
            return kinds.every((kind, i) => tokens[i] && tokens[i].kind === kind);
        }
        function unexpectTemp(c) {
            return `Unexpected ${temp.kind} '${temp.string}', expecting ${c}`;
        }
        function lastOpenEvent() {
            let temp = {};
            for (const event of stack) {
                if (event.kind === 'set-variable' ||
                    event.kind === 'cram-open' ||
                    event.kind === 'event-seq-open' ||
                    event.kind === 'instrument-call') {
                    temp = event;
                }
            }
            return temp;
        }
        function lastExcept(seq, ...kinds) {
            let temp = {};
            for (const event of seq) {
                if (!kinds.includes(event)) {
                    temp = event;
                }
            }
            return temp;
        }
        function isNullOr(object, ...values) {
            return object == null || values.includes(object);
        }
        tokens.push({ kind: 'newline', string: '\n' });
        while (token = tokens.shift()) {
            if (token.kind === 'inline') {
                token.value = token.string;
                pushToken(); continue;
            }
            if (token.kind === 'voice') { pushToken(); continue; }
            if (token.kind === 'octave') {
                if (token.string === '<') token.value = 'down';
                if (token.string === '>') token.value = 'up';
                pushToken(); continue;
            }
            if (token.kind === 'marker') { pushToken(); continue; }
            if (token.kind === 'at-marker') { pushToken(); continue; }
            if (token.kind === 'slash') { pushToken(); continue; }
            if (token.kind === 'note' || token.kind === 'rest') {
                token.value = { pitch: token.string };
                if (token.kind === 'note' && peek('accidentals'))
                    token.value.accidentals = tokens.shift().string;
                token.value.duration = []; temp = [];
                while (true) {
                    if (peek('tie') || peek('newline'))
                        temp.push(tokens.shift());
                    else if (peek('note-length')) {
                        if (isNullOr(lastExcept(temp, 'newline').kind, 'tie')) {
                            token.value.duration.push(tokens.shift().string);
                            temp.push({ kind: 'note-length' });
                        } else {
                            throw new Error(`Expecting note-length.`)
                        }
                    } else break;
                }
                if (temp.length && temp[temp.length - 1].kind === 'newline')
                    tokens.unshift({ kind: 'newline', string: '\n' });
                while (temp.length && temp[temp.length - 1].kind === 'newline')
                    temp.pop();
                if (temp.length && temp[temp.length - 1].kind === 'tie')
                    token.value.slur = true;
                pushToken(); continue;
            }
            if (token.kind === 'name') {
                if (peek('slash') || peek('nickname') || peek('colon')) {
                    token.kind = 'instrument-call';
                    token.value = { instruments: [token.string] };
                    while (peek('slash')) {
                        tokens.shift();
                        temp = tokens.shift();
                        if (temp.kind === 'name')
                            token.value.instruments.push(temp.string);
                        else
                            throw new Error(unexpectTemp('instrument-call'));
                    }
                    if (peek('nickname'))
                        token.value.nickname = tokens.shift().value;
                    temp = tokens.shift();
                    if (!temp)
                        throw new Error(`Unexpected EOF, expecting colon`);
                    if (temp.kind !== 'colon')
                        throw new Error(unexpectTemp('colon'));
                    pushToken(); continue;
                }
                if (peek('equals')) {
                    token.kind = 'set-variable';
                    token.value = { name: token.string };
                    tokens.shift();
                    pushToken(); continue;
                } else {
                    token.kind = 'get-variable';
                    token.value = token.string;
                    pushToken(); continue;
                }
            }
            if (token.kind === 'newline') {
                temp = lastOpenEvent();
                if (temp.kind === 'set-variable' && temp.value.value == null) {
                    for (temp = []; stack.length; temp.unshift(stack.pop()))
                        if (temp[0] && temp[0].kind === 'set-variable') break;
                    if (temp[0] && temp[0].kind === 'set-variable') {
                        token = temp[0];
                        token.value.value = temp.slice(1);
                        pushToken(); continue;
                    } else {
                        throw new Error(`Unexpected empty variable.`);
                    }
                }
                continue;
            }
            if (token.kind === 'cram-open') { pushToken(); continue; }
            if (token.kind === 'cram-close') {
                for (temp = []; stack.length; temp.unshift(stack.pop()))
                    if (temp[0] && temp[0].kind === 'cram-open') break;
                if (temp[0] && temp[0].kind === 'cram-open') {
                    token.kind = 'cram';
                    token.value = { events: temp.slice(1) };
                    if (peek('note-length'))
                        token.value.duration = tokens.shift().string;
                    pushToken(); continue;
                } else {
                    throw new Error(`Unexpected cram-close '}'.`);
                }
            }
            if (token.kind === 'event-seq-open') { pushToken(); continue; }
            if (token.kind === 'event-seq-close') {
                for (temp = []; stack.length; temp.unshift(stack.pop()))
                    if (temp[0] && temp[0].kind === 'event-seq-open') break;
                if (temp[0] && temp[0].kind === 'event-seq-open') {
                    token.kind = 'event-seq';
                    token.value = temp.slice(1);
                    pushToken(); continue;
                } else {
                    throw new Error(`Unexpected event-seq-close ']'.`);
                }
            }
            if (token.kind === 'repeat') { pushToken(); continue; }
            if (token.kind === 'repeat-num') { pushToken(); continue; }
            throw new Error(`Unexpected ${token.kind}.`);
        }
        return stack;
    }

    function midify(str) {
        let events = parse(str);
        
    }

    return {
        tokenize,
        parse,
        midify,
    };
})();

if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = Alda;
} else {
    globalThis.Alda = Alda;
}
