function main() {

	d3.select('#charged input[type="submit"]').on('click', () => {

		save_acc();

	});

	var MAXNUM = 4;		// maximum number of batteries in one device

	var boxes = d3.select("#boxes");
	for(var i=0; i < MAXNUM; i++)	{

		boxes.append('input')
			.attr('type', 'radio').attr('name', 'number').attr('value', i)
		boxes.append('label').text(i + 1);

	}
	boxes.select('input[value="1"]').attr('checked', true);		// 2 batteries in device is a default

	for(var i=0; i < MAXNUM; i++)	{

		boxes.append('div').attr('id', 'num'+i).text( 'Num=' + (i+1) );
		// adding style to global style table
		d3.select('head').append('style').text(`#boxes input[value="${i}"]:not(:checked) ~ #num${i} { display: none }`);

	}

	draw_log();

}

function save_acc()	{

	var acc = d3.select('#charged input[name="accid"]').property("value");
	var vol = d3.select('#charged input[name="volume"]').property("value");
	var box = d3.select('#charged input[name="box"]').property("value").toUpperCase();
	
	fetch(`api/getcsv.php?f=addcharged&accid=${acc}&volume=${vol}&box=${box}`)
	.then( res => res.text() )
	.then( res => {

		draw_log();

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
		console.log(log);
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

