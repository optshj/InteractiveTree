import {useRef,useState,useEffect,useCallback } from 'react';
import styles from '../css/Canvas.module.css';

function Canvas(){
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef(null);
	const [ctx,setCtx] = useState();
	const size:number = 11; //나무의 전체적인 크기
	const frame = 15; //나무가 생성되는 속도
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
	function random(min,max){
		return min + Math.floor(Math.random() * (max - min + 1));
	}
	function branch(startX:number,startY:number,endX:number,endY:number,depth:number,width:number,angle:number){
		if (size === depth) return;
		
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.moveTo(startX,startY);
		ctx.lineTo(endX,endY);
		ctx.stroke();
		const len = depth == 0 ? random(7,10):random(0,12);
		const nextX:number = endX + cos(angle)*(size-depth)*len;
		const nextY:number = endY + sin(angle)*(size-depth)*len;
		requestAnimationFramebranch((endX,endY,nextX,nextY,depth+1,width-1,angle+random(12,23)));
		requestAnimationFramebranch((endX,endY,nextX,nextY,depth+1,width-1,angle-random(12,23)));
		
	}
	const drawing = e => {
		const offsetX = e.nativeEvent.offsetX;
		const offsetY = e.nativeEvent.offsetY;
		requestAnimationFrame(branch(offsetX,window.innerHeight,offsetX,window.innerHeight,0,size,-90));
	}
	return(
		<div className={styles.Canvas}>
			<canvas ref={canvasRef} onMouseDown={e =>drawing(e)}></canvas>
		</div>
	)
}


export default Canvas;