function main() {

	d3.select('#charged input[type="submit"]').on('click', () => save_acc() );

	var MAXNUM = 4;		// maximum number of batteries in one device

	var boxes = d3.select("#boxes");
	for(var i=0; i < MAXNUM; i++)	{

		boxes.append('input')
			.attr('type', 'radio').attr('name', 'number').attr('value', i)
		boxes.append('label').text(i + 1);

	}
	boxes.select('input[value="1"]').attr('checked', true);		// 2 batteries in device is a default

	for(var i = 0; i < MAXNUM; i++)	{

		var div = boxes.append('div').attr('id', 'num'+i);		// .text( 'Num=' + (i+1) );
		fill_boxes(div, i);
		// adding style to global style table
		d3.select('head').append('style').text(`#boxes input[value="${i}"]:not(:checked) ~ #num${i} { display: none }`);

	}

	draw_devices();

	d3.select('#devlist input[type="submit"]').on('click', () => {

		add_device();

	});

	draw_log();

}

function to64(str)	{


	return btoa( String.fromCodePoint(...new TextEncoder().encode(str)));

}

function from64(str) {

	return new TextDecoder().decode(Uint8Array.from(atob(str), (m) => m.codePointAt(0)));

}

function add_device()	{

	var dev = d3.select('#devlist input[name="newdev"]').property("value");
	var num = d3.select('#boxes input[name="number"]:checked').property("value");

	console.log(num, to64(dev));	// , decode(encode(dev)));
	console.log(from64(to64(dev)));

	fetch(`api/getcsv.php?f=adddevice&num=${num}&dev=${to64(dev)}`)
		.then( res => res.text() )
		.then( res => location.reload() );

}

function draw_devices()	{

	

}

function fill_boxes(boxes, n) {

	fetch("api/getcsv.php?f=getboxes&n=" + n)
	.then(res => res.text())
	.then(res => {

		var devs = [];
		res.split('\n').forEach( s => {

			if(s.length === 0)
				return;

			var row = s.split('\t');

			if(row[0] !== '\\N')	{
	
				var batch = [];
				for(var i = 0; i <= n; i ++)
					batch.push( { accid: row[i*3 + 1], box: row[i*3+2], cap: +row[i*3+3] } );

				devs.push(batch);
			
			}
			
		});

		var table = boxes.append('table');
		var thead = table.append('thead');

		thead.append('th').text('Delta');
		for(var j = 0; j <= n; j++)	{

			thead.append('th').text('Id');
			thead.append('th').text('Box');
			thead.append('th').text('Cap');

		}

		var tbody = table.append('tbody');

		for(var i = 0; i != devs.length; i++)	{

			var tr = tbody.append('tr');
			var delta = devs[i][n].cap - devs[i][0].cap;
			tr.append('th').text(delta);

			for(var j = 0; j <= n; j++)	{

				tr.append('td').text(devs[i][j].accid);
				tr.append('td').text(devs[i][j].box);
				tr.append('td').text(devs[i][j].cap);

			}

		}

	});

}


function save_acc()	{

	var acc = d3.select('#charged input[name="accid"]').property("value");
	var vol = d3.select('#charged input[name="volume"]').property("value");
	var box = d3.select('#charged input[name="box"]').property("value").toUpperCase();
	
	fetch(`api/getcsv.php?f=addcharged&accid=${acc}&volume=${vol}&box=${box}`)
	.then( res => res.text() )
	.then( res => {

		location.reload();

	});

}

function draw_log()	{

	fetch("api/getcsv.php?f=getlog")
	.then( res => res.text() )
	.then( res => {

		var log = [];
		res.split('\n').forEach( s => {

			if(s.length === 0)
				return;
			var t = s.split('\t');
			log.push(t);

		});
		d3.select("#log")
		.selectAll('tr')
		.data(log)
		.join( enter => {

			var tr = enter.append('tr');

			tr.append('td').text(d => d[0]);
			tr.append('td').text(d => d[2]);
			tr.append('td').text(d => d[1]);
			tr.append('td').text(d => d[3]);

		}, update => {

			update.select("td:nth-child(1)").text(d => d[0]);
			update.select("td:nth-child(2)").text(d => d[2]);
			update.select("td:nth-child(3)").text(d => d[1]);
			update.select("td:nth-child(4)").text(d => d[3]);

		}, exit => {

			exit.remove();

		});

	});

}

