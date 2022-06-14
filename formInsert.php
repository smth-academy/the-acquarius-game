<?php 
    // Connect to the database
    $db = mysqli_connect('localhost', 'root', '', 'acquariogame');
    //verify the connection 
    if (!$db) {
        die("Connection failed: " . mysqli_connect_error());
    }
    //save username,score,level,time,date
    $username = $_POST['username'];
    $score = $_POST['score'];
    $level = $_POST['level'];
    $time = $_POST['time'];
    //insert username,score,level,time,date in the database
    $sql = "INSERT INTO scores (username, score, level, time) VALUES ('$username','$score','$level','$time');";
    //execute the query
    if (mysqli_query($db, $sql)) {
        echo "New record created successfully";
        header("Location: index.html");
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($db);
    }
    //close the connection
    mysqli_close($db);
?>