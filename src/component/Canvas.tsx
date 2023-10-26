import {useRef,useState,useEffect } from 'react';

function Canvas(){
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef(null);
	const [ctx,setCtx] = useState();
	const size:number = 11; //나무의 전체적인 크기
	const frame = 10; //나무가 생성되는 속도
	
	useEffect(()=> {
		const canvas = canvasRef.current;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		const context = canvas.getContext("2d");
		contextRef.current = context;
		setCtx(context);
	},[]);
	function degToRad(angle) {
		return (angle / 180.0) * Math.PI;
	}
	function cos(angle) {
    	return Math.cos(degToRad(angle));
	}
	function sin(angle) {
		return Math.sin(degToRad(angle));
	}
	function random(min,max){/*min,max 사이의 랜덤한 수 리턴*/
		return min + Math.floor(Math.random() * (max - min + 1));
	}

	function branch(startX,startY,endX,endY,depth,width,angle,cntframe){
		if (size === depth) {
			cancelAnimationFrame(branch);
			return;
		};
		if (cntframe === frame ){
			const len = depth == 0 ? random(7,10):random(0,12);
			const nextX:number = endX + cos(angle)*(size-depth)*len;
			const nextY:number = endY + sin(angle)*(size-depth)*len;
			requestAnimationFrame(()=>branch(endX,endY,nextX,nextY,depth+1,width-1,angle+random(12,23),0));
			requestAnimationFrame(()=>branch(endX,endY,nextX,nextY,depth+1,width-1,angle-random(12,23),0));
		}
		else {
			const gapX = (endX-startX)/frame;
			const gapY = (endY-startY)/frame;
			ctx.beginPath();
			ctx.lineWidth = width;
			ctx.moveTo(startX+gapX*(cntframe),startY+gapY*(cntframe));
			ctx.lineTo(startX+gapX*(cntframe+1),startY+gapY*(cntframe+1));
			ctx.stroke();
			requestAnimationFrame(()=>branch(startX,startY,endX,endY,depth,width,angle,cntframe+1));
		}
	}
	const drawing = e => {
		const offsetX = e.nativeEvent.offsetX;
		requestAnimationFrame(()=>branch(offsetX,window.innerHeight,offsetX,window.innerHeight,0,size,-90,0));
	}
	return(
		<div>
			<canvas ref={canvasRef} onMouseDown={e =>drawing(e)}></canvas>
		</div>
	)
}


export default Canvas;