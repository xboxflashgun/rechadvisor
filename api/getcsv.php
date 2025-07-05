<?php

header('Content-type: text/csv');
header("Cache-control: private");

foreach ($_GET as $k => $v)     {

	if(preg_match('/[^0-9a-z_-]/', $k) ||
		preg_match('/[^0-9A-Za-z =\/\-\+]/', $v))

		die("Oops: $k, $v");

}

$db = pg_pconnect("port=6432 dbname=batts user=readonly password=masha27uk")
	or die("could not connect to DB");

$rows = array();
$timeout = 5;

if( preg_match('/^(get|add|del)/', $_GET['f']) )
    $_GET['f']();

$rep = implode($rows);

header("Cache-control: max-age=$timeout");

echo $rep;

// usage: GET http://host/api/getcsv.php?f=func&par=parameters

function adddevice()	{

	global $db;
	$dev = $_GET['dev'];
	$num = $_GET['num'];

	pg_query_params($db, 'insert into places(num,place) values($1,$2) on conflict do nothing', array($num, $dev));

}

function getplace($place)	{

	global $db;
	return (
		pg_fetch_row(
			pg_query_params($db, "insert into places(place) value($1) on conflict do nothing returning placeid", array($place))
		)[0]
	);

}

function getlog()	{

	global $db, $rows;
	$rows = pg_copy_to($db, "(
		select accid,volume,box,max(vdate) from vollog group by 1,2,3 order by  4 desc,3 desc
	)", chr(9));

}

//
function addcharged()	{

	global $db, $rows;
	$accid = $_GET['accid'];
	$vol = $_GET['volume'];
	$box = $_GET['box'];
	pg_query_params($db, '
		insert into vollog(vdate,accid,volume,box) 
		values(now(), $1, $2, $3)
		on conflict(vdate,accid) do update set volume=$2,box=$3
	', array($accid, $vol, $box));

}

function getboxes()	{

	global $db, $rows;

	$n = 0 + $_GET['n'];

	$req = "
		with tab as (
			select accid,
			lead(volume) over (order by volume) - volume from vollog order by 2
		) select 
			lead(volume,$n) over (order by volume) - volume as delta,
	";

	for($i = 0; $i <= $n; $i++) {
		$req .= "
			lead(accid,$i) over (order by volume) as acc$i,
			lead(box,$i) over (order by volume) as box$i,
			lead(volume,$i) over (order by volume) as cap$i,
		";
	}

	$req .= "
			0
		from vollog 
		join tab using (accid) 
		order by delta, 4 desc
	";

	$rows = pg_copy_to($db, "( $req )", chr(9));

}
	





