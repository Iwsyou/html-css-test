//开发游戏页面组件
//定义一个创建canvas组件的函数
var SQUARE_ROWS = 20;
var SQUARE_COLS = 14;
var CELL_SIZE = 24;
// 没方块是0
var NO_BLOCK = 0;
var square_canvas;
var square_ctx;
// 记录当前积分
var curScore = 0;
// 记录当前速度
var curSpeed = 1;
// 记录曾经的最高积分
var maxScore = 0;
var curScoreEle , curSpeedEle , maxScoreEle;
var curTimer;
// 记录当前是否游戏中的旗标
var isPlaying = true;
// 记录正在下掉的四个方块
var currentFall;
// 定义方块的颜色
colors = ["#fff", "#f00" , "#0f0" , "#00f"
	, "#c60" , "#f0f" , "#0ff" , "#609"];

//该数组用于记录底下已有方块
var square_status=[];
for(var i=0;i<SQUARE_ROWS;i++){
	square_status[i]=[];
	for(var j=0;j<SQUARE_COLS;j++){
		square_status[i][j]=NO_BLOCK;
	}
}

var createCanvas=function(rows,cols,cellWidth,cellHeight){
	square_canvas=document.createElement("canvas");
	square_canvas.width=cols*cellWidth;
	square_canvas.height=rows*cellHeight;
	square_canvas.style.border="1px solid black";

	square_ctx=square_canvas.getContext('2d');

	square_ctx.beginPath();
	for(var i=1;i<SQUARE_ROWS;i++){
		square_ctx.moveTo(0,i*CELL_SIZE);
		square_ctx.lineTo(SQUARE_COLS*CELL_SIZE,i*CELL_SIZE)
	}

	for(var i=1;i<SQUARE_COLS;i++){
		square_ctx.moveTo(i*CELL_SIZE,0);
		square_ctx.lineTo(i*CELL_SIZE,SQUARE_ROWS*CELL_SIZE)
	}

	square_ctx.closePath();
	square_ctx.strokeStyle="#aaa";
	square_ctx.lineWidth=0.3;
	square_ctx.stroke();
}

//初始化游戏状态

/*//该数组用于记录底下已有方块
var square_status=[];
for(var i=0;i<SQUARE_ROWS;i++){
	square_status[i]=[];
	for(var j=0;j<SQUARE_COLS;j++){
		square_status[i][j]=NO_BLOCK;
	}
}
*/
//定义几种可能出现的方块组合
var blockArr=[
	//Z
	[
		{x:SQUARE_COLS/2-1,y:0,color:1},
		{x:SQUARE_COLS/2,y:0,color:1},
		{x:SQUARE_COLS/2,y:1,color:1},
		{x:SQUARE_COLS/2+1,y:1,color:1},
	],
	//反Z
	[
		{x:SQUARE_COLS/2+1,y:0,color:2},
		{x:SQUARE_COLS/2,y:0,color:2},
		{x:SQUARE_COLS/2,y:1,color:2},
		{x:SQUARE_COLS/2-1,y:1,color:2},
	],
	//田
	[
		{x:SQUARE_COLS/2-1,y:0,color:3},
		{x:SQUARE_COLS/2,y:0,color:3},
		{x:SQUARE_COLS/2,y:1,color:3},
		{x:SQUARE_COLS/2-1,y:1,color:3},
	],
	//L
	[
		{x:SQUARE_COLS/2-1,y:0,color:4},
		{x:SQUARE_COLS/2-1,y:1,color:4},
		{x:SQUARE_COLS/2-1,y:2,color:4},
		{x:SQUARE_COLS/2,y:2,color:4},
	],
	//J
	[
		{x:SQUARE_COLS/2,y:0,color:5},
		{x:SQUARE_COLS/2,y:1,color:5},
		{x:SQUARE_COLS/2,y:2,color:5},
		{x:SQUARE_COLS/2-1,y:2,color:5},
	],
	//竖
	[
		{x:SQUARE_COLS/2,y:0,color:6},
		{x:SQUARE_COLS/2,y:1,color:6},
		{x:SQUARE_COLS/2,y:2,color:6},
		{x:SQUARE_COLS/2,y:3,color:6},
	],
	//土
	[
		{x:SQUARE_COLS/2,y:0,color:7},
		{x:SQUARE_COLS/2-1,y:1,color:7},
		{x:SQUARE_COLS/2,y:1,color:7},
		{x:SQUARE_COLS/2+1,y:1,color:7},
	]
];

//定义初始化正在掉落的方块
var initBlock=function(){
	var rand=Math.floor(Math.random()*blockArr.length);
	currentFall=[
{
	x:blockArr[rand][0].x,y:blockArr[rand][0].y,
	color:blockArr[rand][0].color
},
{
	x:blockArr[rand][1].x,y:blockArr[rand][1].y,
	color:blockArr[rand][1].color
},
{
	x:blockArr[rand][2].x,y:blockArr[rand][2].y,
	color:blockArr[rand][2].color
},
{
	x:blockArr[rand][3].x,y:blockArr[rand][3].y,
	color:blockArr[rand][3].color
}
];
}

//实现游戏逻辑

//处理方块掉落
var moveDown=function(){
	var canDown=true;
	for(var i=0;i<currentFall.length;i++){
		if(currentFall[i].y>=SQUARE_ROWS-1){
			canDown=false;
			break;
		}
		if(square_status[currentFall[i].y+1][currentFall[i].x]!=NO_BLOCK){
			canDown=false;
			break;
		}
	}

	if(canDown){
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			square_ctx.fillStyle='white';
			square_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,
				CELL_SIZE-2,CELL_SIZE-2);
		}

		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			cur.y++;
		}

		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			square_ctx.fillStyle=colors[cur.color];
			square_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,
				CELL_SIZE-2,CELL_SIZE-2);

		}

	}

	else{
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			if(cur.y<2){
				localStorage.removeItem("curScore");
				localStorage.removeItem("square_status");
				localStorage.removeItem("curSpeed");

				if(confirm("你已经输了！是否参与排名")){
					maxScore=localStorage.getItem("maxScore");
					maxScore=maxScore==null?0:maxScore;
					if(curScore>=maxScore){
						localStorage.setItem("maxScore",curScore);
					}
				}

				isPlaying=false;
				clearInterval(curTimer);
				return;
			}
			square_status[cur.y][cur.x]=cur.color;
		}
		lineFull();
		localStorage.setItem("square_status",JSON.stringify(square_status));
		initBlock();
	}
}

/*var moveDown = function()
{
	// 定义能否下掉的旗标
	var canDown = true;    // ①
	// 遍历每个方块，判断是否能向下掉
	for (var i = 0 ; i < currentFall.length ; i++)
	{
		// 判断是否已经到“最底下”
		if(currentFall[i].y >= SQUARE_ROWS - 1)
		{
			canDown = false;
			break;
		}
		// 判断下一格是否“有方块”, 如果下一格有方块，不能向下掉
		if(square_status[currentFall[i].y + 1][currentFall[i].x] != NO_BLOCK)
		{
			canDown = false;
			break;
		}
	}
	// 如果能向下“掉”
	if(canDown)
	{
		// 将下移前的每个方块的背景色涂成白色
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 设置填充颜色
			square_ctx.fillStyle = 'white';
			// 绘制矩形
			square_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
		// 遍历每个方块, 控制每个方块的y坐标加1。
		// 也就是控制方块都下掉一格
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			cur.y ++;
		}
		// 将下移后的每个方块的背景色涂成该方块的颜色值
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 设置填充颜色
			square_ctx.fillStyle = colors[cur.color];
			// 绘制矩形
			square_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
	}
	// 不能向下掉
	else
	{
		// 遍历每个方块, 把每个方块的值记录到tetris_status数组中
		for (var i = 0 ; i < currentFall.length ; i++)
		{
			var cur = currentFall[i];
			// 如果有方块已经到最上面了，表明输了
			if(cur.y < 2)
			{
				// 清空Local Storage中的当前积分值、游戏状态、当前速度
				localStorage.removeItem("curScore");
				localStorage.removeItem("square_status");
				localStorage.removeItem("curSpeed");
				if(confirm("您已经输了！是否参数排名？"))
				{
					// 读取Local Storage里的maxScore记录
					maxScore = localStorage.getItem("maxScore");
					maxScore = maxScore == null ? 0 : maxScore ;
					// 如果当前积分大于localStorage中记录的最高积分
					if(curScore >= maxScore)
					{
						// 记录最高积分
						localStorage.setItem("maxScore" , curScore);
					}
				}
				// 游戏结束
				isPlaying = false;
				// 清除计时器
				clearInterval(curTimer);
				return;
			}
			// 把每个方块当前所在位置赋为当前方块的颜色值
			square_status[cur.y][cur.x] = cur.color;
		}
		// 判断是否有“可消除”的行
		lineFull();
		// 使用Local Storage记录俄罗斯方块的游戏状态
		localStorage.setItem("square_status" , JSON.stringify(square_status));
		// 开始一组新的方块。
		initBlock();
	}
}*/
//判断一行是否满
var lineFull=function(){
	for(var i=0;i<SQUARE_ROWS;i++){
		var flag=true;
		for(var j=0;j<SQUARE_COLS;j++){
			if(square_status[i][j]==NO_BLOCK){
				flag=false;
				break;
			}
		}

		if(flag){
			curScoreEle.innerHTML=curScore+=100;
			localStorage.setItem("curScore",curScore);

			if(curScore>=curSpeed*curSpeed*500){
				curSpeedEle.innerHTML=curSpeed+=1;
				localStorage.setItem("curSpeed",curSpeed);
				clearInterval(curTimer);
				curTimer=setInterval("moveDown();",500/curSpeed);
			}

			for(var k=i;k>0;k--){
				for(var l=0;l<SQUARE_COLS;l++){
					square_status[k][l]=square_status[k-1][l];
				}
			}
			drawBlock();
		}
	}
}

//绘制俄罗斯方块状态
var drawBlock=function(){
	for(var i=0;i<SQUARE_ROWS;i++){
		for(var j=0;j<SQUARE_COLS;j++){
			if(square_status[i][j]!=NO_BLOCK){
				square_ctx.fillStyle=colors[square_status[i][j]];
				square_ctx.fillRect(j*CELL_SIZE+1,i*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
			}
			else{
				square_ctx.fillStyle="white";
				square_ctx.fillRect(j*CELL_SIZE+1,i*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
			}
		}
	}
}

//为按键绑定监听器
window.focus();
window.onkeydown=function(evt){
	switch(evt.keyCode){
		//下
		case 40:
		if(!isPlaying)
			return;
		moveDown();
		break;
		//左
		case 37:
		if(!isPlaying)
			return;
		moveLeft();
		break;
		//右
		case 39:
		if(!isPlaying)
			return;
		moveRight();
		break;
		//上
		case 38:
		if(!isPlaying)
			return;
		rotate();
		break;
	}
}

//定义左移方块函数

var moveLeft=function(){
	var canLeft=true;
	for(var i=0;i<currentFall.length;i++){
		if(currentFall[i].x<=0){
			canLeft=false;
			break;
		}
		if(square_status[currentFall[i].y][currentFall[i].x-1]!=NO_BLOCK){
			canLeft=false;
			break;
		}
	}

	if(canLeft){
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			square_ctx.fillStyle='white';
			square_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			cur.x--;
		}
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			square_ctx.fillStyle=colors[cur.color];
			square_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
	}
}

//定义方块右移函数

var moveRight=function(){
	var canRight=true;
	for(var i=0;i<currentFall.length;i++){
		if(currentFall[i].x>=SQUARE_COLS-1){
			canRight=false;
			break;
		}
		if(square_status[currentFall[i].y][currentFall[i].x+1]!=NO_BLOCK){
			canRight=false;
			break;
		}
	}

	if(canRight){
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			square_ctx.fillStyle="white";
			square_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			cur.x++;
		}
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			square_ctx.fillStyle=colors[cur.color];
			square_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
	}
}


//处理方块旋转

//定义旋转方块函数
var rotate=function(){
	var canRotate=true;
	for(var i=0;i<currentFall.length;i++){
		var preX=currentFall[i].x;
		var preY=currentFall[i].y;

		//把第3块当成旋转中心
		if(i!=2){
			var afterRotateX=currentFall[2].x+preY-currentFall[2].y;
			var afterRotateY=currentFall[2].y-preX+currentFall[2].x;
			if(square_status[afterRotateY][afterRotateX+1]!=NO_BLOCK){
				canRotate=false;
				break;
			}
			if(afterRotateX<0||square_status[afterRotateY-1][afterRotateX]!=NO_BLOCK){
				moveRight();
				afterRotateX=currentFall[2].x+preY-currentFall[2].y;
				afterRotateY=currentFall[2].y-preX+currentFall[2].x;
				break;
			}
			if(afterRotateX<0||square_status[afterRotateY-1][afterRotateX]!=NO_BLOCK){
				moveRight();
				break;
			}

			if(afterRotateX>=SQUARE_COLS-1||square_status[afterRotateY][afterRotateX+1]!=NO_BLOCK){
				moveLeft();
				afterRotateX=currentFall[2].x+preY-currentFall[2].y;
				afterRotateY=currentFall[2].y-preX+currentFall[2].x;
				break;
			}
			if(afterRotateX>=SQUARE_COLS-1||square_status[afterRotateY][afterRotateX+1]!=NO_BLOCK){
				moveLeft();
				break;
			}
			
		}

		if(canRotate){
			for(var i=0;i<currentFall.length;i++){
				var cur=currentFall[i];
				square_ctx.fillStyle="white";
				square_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
			}

			for(var i=0;i<currentFall.length;i++){
				var preX=currentFall[i].x;
				var preY=currentFall[i].y;
				if(i!=2){
					currentFall[i].x=currentFall[2].x+preY-currentFall[2].y;
					currentFall[i].y=currentFall[2].y+currentFall[2].x-preX;
				}
			}

			for(var i=0;i<currentFall.length;i++){
				var cur=currentFall[i];
				square_ctx.fillStyle=colors[cur.color];
				square_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);	
			}
		}
	}
}


//初始化游戏状态

window.onload=function(){
	createCanvas(SQUARE_ROWS,SQUARE_COLS,CELL_SIZE,CELL_SIZE);
	document.body.appendChild(square_canvas);
	curScoreEle=document.getElementById("curScoreEle");
	curSpeedEle=document.getElementById("curSpeedEle");
	maxScoreEle=document.getElementById("maxScoreEle");

	var tmpStatus=localStorage.getItem("square_status");
	square_status=tmpStatus==null?square_status:JSON.parse(tmpStatus);

	drawBlock();
	curScore=localStorage.getItem("curScore");
	curScore=curScore==null?0:parseInt(curScore);
	curScoreEle.innerHTML=curScore;

	maxScore=localStorage.getItem("maxScore");
	maxScore=maxScore==null?0:parseInt(maxScore);
	maxScoreEle.innerHTML=maxScore;

	curSpeed=localStorage.getItem("curSpeed");
	curSpeed=curSpeed==null?1:parseInt(curSpeed);
	curSpeedEle.innerHTML=curSpeed;
	initBlock();
	curTimer=setInterval("moveDown();",500/curSpeed);
}


/*var SQUARE_ROWS = 20;
var SQUARE_COLS = 14;
var CELL_SIZE = 24;
// 没方块是0
var NO_BLOCK = 0;
var square_canvas;
var square_ctx;
// 记录当前积分
var curScore = 0;
// 记录当前速度
var curSpeed = 1;
// 记录曾经的最高积分
var maxScore = 0;
var curScoreEle , curSpeedEle , maxScoreEle;
var curTimer;
// 记录当前是否游戏中的旗标
var isPlaying = true;
// 记录正在下掉的四个方块
var currentFall;
// 定义方块的颜色
colors = ["#fff", "#f00" , "#0f0" , "#00f"
	, "#c60" , "#f0f" , "#0ff" , "#609"];*/