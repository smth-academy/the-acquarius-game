<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="style.css">
        <link rel="icon" href="./Images/favicon.ico" type="image/x-icon">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <title>Leaderboard</title>
    </head>
    <body>
        <div id="title"><div id="titleText">LEADERBOARD</div></div>
        <div id="leaderboard1">
            <div style="padding: 1.5vw; border-radius: 1vw; background-color: rgba(255, 255, 255, 0.7);" class="center1">
                <table>
                <tr> 
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Level</th>
                    <th>Time</th>
                </tr>
                <?php
                    //connect to database
                    $db = mysqli_connect("localhost", "root", "", "acquariogame");
                    if (mysqli_connect_errno()) {
                        echo "Failed to connect to MySQL: " . mysqli_connect_error();
                    }
                    //order by score and time descending
                    $sql = "SELECT * FROM scores ORDER BY score DESC, time ASC";
                    $result = mysqli_query($db, $sql);
                    $rank = 1;
                    //display leaderboard
                    while($row = mysqli_fetch_assoc($result)){
                        echo "<tr>";
                        echo "<td>".$rank."</td>";
                        echo "<td style='text-align: left;'>".$row['username']."</td>";
                        echo "<td>".$row['score']."</td>";
                        echo "<td>".$row['level']."</td>";
                        echo "<td>".$row['time']."</td>";
                        echo "</tr>";
                        $rank++;
                    }
                ?>
            </table>
            </div>
        </div>
    </body>
</html>