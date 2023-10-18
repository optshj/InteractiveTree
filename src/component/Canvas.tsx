import {useRef,useState,useEffect,useCallback } from 'react';
import styles from '../css/Canvas.module.css';

function Canvas(){
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef(null);
	const [ctx,setCtx] = useState();
	
	useEffect(()=> {
		const canvas = canvasRef.current;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		const context = canvas.getContext("2d");
		contextRef.current = context;
		setCtx(context);
	},[]);
	const drawing = e => {
		const offsetX = e.nativeEvent.offsetX;
		const offsetY = e.nativeEvent.offsetY;
		const len = 200;
		ctx.lineWidth = 10;
		ctx.moveTo(offsetX,0);
		ctx.lineTo(offsetX,len);
		ctx.stroke();
		
	}
	return(
		<div className={styles.Canvas}>
			<canvas ref={canvasRef} onMouseDown={e =>drawing(e)}></canvas>
		</div>
	)
}


export default Canvas;