$command = ""
foreach ($i in $args) {
  if ($i.contains("*")) {
    $list = gci $i | resolve-path -relative
    foreach ($j in $list) {
      if ($command) {
        $command = $command + " "
      }
      $command = $command + $j
    }
  } else {
    if ($command) {
      $command = $command + " "
    }
    $command = $command + $i
  }
}

echo $command
iex $command
