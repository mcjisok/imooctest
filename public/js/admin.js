$(function(){
	$('.del').click(function(e){
		var target = $(e.target)
		//var id = target.date('id')
		var id = $(this).attr("date-id")
		console.log(id)
		var tr = $('.item-id-' + id)

		$.ajax({
			type:'DELETE',
			url:'/admin/list?id=' + id
		})
		.done(function(results){
			if(results.success === 1){
				if(tr.length> 0){
					tr.remove()
				}
			}
		})
	})

	$('.del_user').click(function(e){
		var target = $(e.target)
		//var id = target.date('id')
		var id = $(this).attr("date-id")
		console.log(id)
		var tr = $('.item-id-' + id)

		$.ajax({
			type:'DELETE',
			url:'/admin/userlist?id=' + id
		})
		.done(function(results){
			if(results.success === 1){
				if(tr.length> 0){
					tr.remove()
				}
			}
		})
	})
})