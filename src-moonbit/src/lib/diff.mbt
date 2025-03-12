// https://docs.moonbitlang.cn/example/myers-diff/myers-diff.html

pub struct Line {
  number: Int  // Start from 1
  text: String // Does not include newline
}

fn Line::new(number: Int, text: String) -> Line {
  Line::{ number, text }
}

fn lines(str: String) -> Array[Line] {
  let lines = Array::new(capacity=50)
  let mut line_number = 0
  for line in str.split("\n") {
    line_number = line_number + 1
    lines.push(Line::new(line_number, line))
  } else {
    return lines
  }
}

pub type BPArray[T] Array[T] // Supports negative index numbers

fn BPArray::make[T](capacity: Int, default: T) -> BPArray[T] {
  BPArray(Array::make(capacity, default))
}

fn copy(self: BPArray[Int]) -> BPArray[Int] {
  let BPArray(arr) = self
  let newarr = Array::make(arr.length(), 0)
  for i = 0; i < arr.length(); i = i + 1 {
    newarr[i] = arr[i]
  } else {
    BPArray(newarr)
  }
}

fn op_get[T](self: BPArray[T], index: Int) -> T {
  let BPArray(arr) = self
  if index < 0 {
    arr[arr.length() + index]
  } else {
    arr[index]
  }
}

fn op_set[T](self: BPArray[T], index: Int, value: T) -> Unit {
  let BPArray(arr) = self
  if index < 0 {
    arr[arr.length() + index] = value
  } else {
    arr[index] = value
  }
}

fn shortest_edit(
  old~ : Array[Line],
  new~ : Array[Line]
) -> Array[(BPArray[Int], Int)] {
  let n = old.length()
  let m = new.length()
  let max = n + m
  let v = BPArray::make(2 * max + 1, 0)
  let trace = []
  fn push(v : BPArray[Int], d : Int) -> Unit {
    trace.push((v, d))
  }
  for d = 0; d < max + 1; d = d + 1 {
    push(v.copy(), d)
    for k = -d; k < d + 1; k = k + 2 {
      let mut x = 0
      let mut y = 0
      if k == -d || (k != d && v[k - 1] < v[k + 1]) {
        x = v[k + 1]
      } else {
        x = v[k - 1] + 1
      }
      y = x - k
      while x < n && y < m && old[x].text == new[y].text {
        x = x + 1
        y = y + 1
      }
      v[k] = x
      if x >= n && y >= m {
        return trace
      }
    }
  } else {
    abort("shortest_edit")
  }
}

pub enum Edit {
  Insert(new~ : Line)
  Delete(old~ : Line)
  Equal(old~ : Line, new~ : Line)
}

fn backtrack(
  new~ : Array[Line],
  old~ : Array[Line],
  trace : Array[(BPArray[Int], Int)]
) -> Array[Edit] {
  let mut x = old.length()
  let mut y = new.length()
  let edits = Array::new(capacity=trace.length())

  for i = trace.length() - 1; i >= 0; i = i - 1 {
    let (v, d) = trace[i]
    let k = x - y
    let prev_k = if k == -d || (k != d && v[k - 1] < v[k + 1]) {
      k + 1
    } else {
      k - 1
    }
    let prev_x = v[prev_k]
    let prev_y = prev_x - prev_k
    while x > prev_x && y > prev_y {
      x = x - 1
      y = y - 1
      edits.push(Equal(old=old[x], new=new[y]))
    }
    if d > 0 {
      if x == prev_x {
        edits.push(Insert(new=new[prev_y]))
      } else if y == prev_y {
        edits.push(Delete(old=old[prev_x]))
      }
      x = prev_x
      y = prev_y
    }
  } else {
    edits
  }
}

fn print_edit(edit: Edit) -> String {
  match edit {
    Equal(_) as edit => "0 \{edit.old.number} \{edit.new.number}"
    Insert(_) as edit => "1 \{edit.new.number}"
    Delete(_) as edit => "2 \{edit.old.number}"
  }
}

fn print_edits(diff: Array[Edit]) -> String {
  let buf = @buffer.new(size_hint=100)
  for i = diff.length(); i > 0; i = i - 1 {
    buf.write_string(print_edit(diff[i - 1]))
    buf.write_char('\n')
  } else {
    buf.contents().to_unchecked_string()
  }
}

pub fn diff(old: String, new: String) -> String {
  let old = lines(old)
  let new = lines(new)
  let trace = shortest_edit(old~, new~)
  let edits = backtrack(old~, new~, trace)
  print_edits(edits)
}
