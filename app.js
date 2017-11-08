var express = require('express')
var path = require('path')
var mongoose = require('mongoose')  //获取Mongodb
var Movie = require('./models/movie') //获取模型
var User = require('./models/user') //获取注册用户需要用到的mongodb编译好的模型

var _ = require('underscore')
var port = process.env.PORT || 3000
var app = express()

var bodyParser = require('body-parser');


app.locals.moment = require('moment')
// mongoose.connect('mongodb://localhost/test',{useMongoClient:true})
mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true})

app.locals.moment = require('moment')
app.set('views','./views/pages')
app.set('view engine','jade')

app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port)
console.log('imooc started on port' + port)

//index page


app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
			title:'影院热度播报',
			movies:movies
		})
	})
})

app.get('/movie/:id',function(req,res){
	var id = req.params.id

	Movie.findById(id,function(err,movie){
		res.render('detail',{
				title:movie.title,
				movie:movie
		})
	})
})

app.get('/admin/new',function(req,res){
	res.render('admin',{
		title:'imooc 后台录入页面',
		movie:{
			doctor:'',
			country:'',
			title:'',
			year:'',
			poster:'',
			language:'',
			flash:'',
			summary:''
		}
	})
})

app.get('/admin/update/:id',function(req,res){
	var id = req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'imooc 后台更新页面',
				movie:movie
			})
		})
	}
})

// admin post movie
app.post('/admin/movie/new',function(req,res){
	//console.log(req)
	//res.redirect('/movie/'+_movie.id)
	var movieObj = req.body.movie
	console.log(req.body.movie)
	var id = req.body.movie._id
	

	var _movie

	if(id !=='undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}

			_movie = _.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
			    }

			    res.redirect('/movie/'+_movie.id)
			})

		})
	}else{
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash,
		})

		_movie.save(function(err,movie){
				if(err){
					console.log(err)
			    }

			    res.redirect('/movie/'+_movie.id)
			})
	}
})

//列表页
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'imooc 列表页',
			movies:movies
		})
	})
})

//列表页删除后跳转的路由
app.delete('/admin/list',function(req,res){
	var id = req.query.id
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success:1})
			}
		})
	}
})


//注册路由
app.post('/user/singup',function(req,res){
var _user = req.body.user;
	User.findOne({name: _user.name}, function (err, user) {
		if (err) {
		  console.log(err);
		}

		if (user) {
		  return res.redirect('/signin');
		} 

		else{
		var user = new User(_user);
		user.save(function (err, user) {
			if (err) {
			   console.log(err)
			}
		    res.redirect('/admin/userlist')
		  })
		}

	})	
})


//注册用户列表页
app.get('/admin/userlist',function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userlist',{
			title:'imooc 用户列表页',
			users:users
		})
	})
})

//删除用户路由
app.delete('/admin/userlist',function(req,res){
	var id = req.query.id
	if(id){
		User.remove({_id:id},function(err,user){
			if(err){
				console.log(err)
			}
			else{
				res.json({success:1})
			}
		})
	}
})

//登录页
app.post('/user/singin',function(req,res){
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err)
		}

		if(!user){
			return res.redirect('/')
		}

		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}

			if(isMatch){
				return res.redirect('/')
			}

			else{
				console.log('Password is not matched')
			}
		})
	})

})
// app.post('/user/singup/:userid',function(req,res){
// 	var _userid = req.params.userid  //params直接拿到变量也就是userid
// 	
// 	
// 	'/user/singup/1111?userid=1234'
// 	var _userid = req.query.userid   //query通过url后面穿的参数拿userid
// 	
// 	如果是表单提交比如POST，则采用req.body.userid拿到userid
// 	console.log(_user)
// })



//404页面
app.use(function(req,res,next){
	res.status(404)
	res.send('404-Not Found')
})

// app.get('/admin/list',function(req,res){
// 	res.render('list',{
// 		title:'imooc 列1表页',
// 		movies:[{
// 			title:'钢铁侠1',
// 			_id:1,
// 			doctor:'诺兰',
// 			country:'美国',
// 			year:2011,
// 			language:'英语'
// 		},
// 		{
// 			title:'钢铁侠1',
// 			_id:1,
// 			doctor:'诺兰',
// 			country:'美国',
// 			year:2011,
// 			language:'英语'
// 		},
// 		{
// 			title:'钢铁侠1',
// 			_id:1,
// 			doctor:'诺兰',
// 			country:'美国',
// 			year:2011,
// 			language:'英语'
// 		},
// 		{
// 			title:'钢铁侠1',
// 			_id:1,
// 			doctor:'诺兰',
// 			country:'美国',
// 			year:2011,
// 			language:'英语'
// 		},]
// 	})
// })