<?
    require "api/index.php";
    $php = new phpapi();

    echo($phpInit->getTop10Users());
?>