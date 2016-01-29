<?php
class Garmin_Connect_Service{
	
	public function getJson(){
		if($this->validate())
		{
			$url = $_POST['url'];
			
			$arrContextOptions=array(
			    "ssl"=>array(
			        "verify_peer"=>false,
			        "verify_peer_name"=>false,
			    ),
			);  

			$json = file_get_contents($url, false, stream_context_create($arrContextOptions));
			return $json;
		}
		else
		{
			return '{error : "error validation"}';
		}
	}

	private function validate(){
		$result = true;
		if($_SERVER['REQUEST_METHOD'] != 'POST')
		{
			$result = false;
		} 
		else if(empty($_POST['url']))
		{
			$result = false;	
		}
		
		return $result;
	}
}

$gc = new Garmin_Connect_Service();
$data = $gc->getJson();
echo $data;


?>