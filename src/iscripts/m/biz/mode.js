// AUTHOR:   SongErwei
// ROLE:    	
// CREATED:  2016-05-21 16:43:00
 
// 提交方案


function init_pic_upload(id) {
    var sel_prog = '#upload-progress';
    // var prog = new ProgressBar.Circle('.upload-wait', {
    //     strokeWidth: 5,
    //     color: '#FD4701',
    //     from: {color: '#FD4701'},
    //     to: {color: '#ff0000'},

    //     // 背景线
    //     trailColor: '#DFE1E6',
    //     trailWidth: 3
    // });

    var alerted = false;
    $('#fileupload').removeHide().dropzone({
        url: api.make_url('demand/image'),
        method: 'post',
        withCredentials: true,
        paramName: 'demand',
        params: {'demand_id': id},
        maxFiles: 1,
        maxfilesexceeded: function() {
        },
//      uploadprogress: function(file, perc) {
        totaluploadprogress: function(perc) {
            if ($(sel_prog).hasHide()) {
                $(sel_prog).removeHide();
            }

            // prog.set(perc / 100);
        },
        success: function(file, json) {
            olog('resp json: ' + json);
            if (json.succ !== '1') {
//                alert(json.msg);
            }
        },
        queuecomplete: function() {
            $(sel_prog).addHide();
        }
    });

	if ('progress' === qs('test')) {
		test_progress_bar(prog);
	}
}

function test_progress_bar(prog) {
	$('#upload-progress').removeHide();

	var n = 0;
	setInterval(function() {
		prog.set((n += 10) / 100);
	}, 100);
}
