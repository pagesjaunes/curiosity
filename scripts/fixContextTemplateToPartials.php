<?php
// CONFIGURE BELOW
$esHostProtocol = 'http'; 
$esHost = 'localhost';
$esPort = '9200';
$indexName = 'curiosity-config';
$docType = 'context-doc';

$data = file_get_contents($esHostProtocol."://".$esHost.":".$esPort."/".$indexName."/".$docType."/_search?size=1000");
$contexts = json_decode($data);
$hits = $contexts->hits;

foreach ($hits->hits as $hit) {
	$source = json_encode($hit->_source);
	$source = str_replace("\"template\/", "\"partials\/", $source);

    $endPointURL = $esHostProtocol . '://' . $esHost . ':' . $esPort . '/' . $indexName . '/' . $docType . '/' . $hit->_id;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $endPointURL);
    curl_setopt($ch, CURLOPT_PORT, $esPort);
    curl_setopt($ch, CURLOPT_TIMEOUT, 200);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FORBID_REUSE, 0);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $source);
    $response = curl_exec($ch);
}
?>