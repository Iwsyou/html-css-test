//开发游戏页面组件
//定义一个创建canvas组件的函数
var createCanvas=function(rows,cols,cellWidth,cellHeight){
	square_canvas=document.createElement("canvas");
	square_canvas.width=cols*cellWidth;
	square_canvas.height=rows*cellHeight;
	square_canvas.style.border="1px solid black";

	square_ctx=square_canvas.getContext('2d');

	square_ctx.beginPath();
	for(var i=0;i<SQUARE_ROWS;i++){
		square_ctx.moveTo(0,i*CELL_SIZE);
		square_ctx.lineTo(SQUARE_COLS*CELL_SIZE,i*CELL_SIZE)
	}

	for(var i=0;i<SQUARE_COLS;i++){
		square_ctx.moveTo(i*CELL_SIZE,0);
		square_ctx.lineTo(i*CELL_SIZE,SQUARE_ROWS*CELL_SIZE)
	}

	square_ctx.closePath();
	square_ctx.strokeStyle="#aaa";
	square_ctx.lineWidth=0.3;
	square_ctx.stroke();
}

//定义数据模型

//定义下落方块的四个方块位置
currentFall=[
{
	x:blockArr[rand][0].x,y:blockArr[rand][0].y,
	color:blockArr[rand][0].color
}
{
	x:blockArr[rand][1].x,y:blockArr[rand][1].y,
	color:blockArr[rand][1].color
}
{
	x:blockArr[rand][2].x,y:blockArr[rand][2].y,
	color:blockArr[rand][2].color
}
{
	x:blockArr[rand][3].x,y:blockArr[rand][3].y,
	color:blockArr[rand][3].color
}
];

//初始化游戏状态

//该数组用于记录底下已有方块
var square_status=[];
for(var i=0;i<SQUARE_ROWS;i++){
	square_status[i]=[];
	for(var j=0;j<SQUARE_COLS;j++){
		square_status[i][j]=NO_BLOCK;
	}
}

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
}
{
	x:blockArr[rand][1].x,y:blockArr[rand][1].y,
	color:blockArr[rand][1].color
}
{
	x:blockArr[rand][2].x,y:blockArr[rand][2].y,
	color:blockArr[rand][2].color
}
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
		if(currentFall[i].y>SQUARE_ROWS-1){
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
			square_ctx.fillstyle='white';
			square_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,
				CELL_SIZE-2,CELL_SIZE-2);
		}

		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			cur.y++;
		}

		for(i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			square_ctx.fillstyle=colors[cur.color];
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


		}
	}
}