import { useCallback,useRef,useState,useEffect } from 'react';
import styles from '../css/Canvas.module.css';
import {BsFillMoonFill,BsFillSunFill} from "react-icons/bs";

function Canvas(){
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef(null);
	const [ctx,setCtx] = useState();
	const [windowSize,setWindowSize] = useState({ // 캔버스 창 사이즈
		width:window.innerWidth,
		height:window.innerHeight
	})
	const [dark,setDark] = useState(false); // 다크모드
	const size:number = 11; //나무의 전체적인 크기
	const frame = 10; //나무가 생성되는 속도
	const colors = ['#FF7E9D','#22D6B2','#B4C3FF','#3CFBFF','#FFE650','#F08C8C','#F49551'];
	
	const onDark = () => {
		setDark(!dark);
		ctx.clearRect(0,0,windowSize.width,windowSize.height);
	}
	const onResize = useCallback(()=> { //창 사이즈가 바뀔 때 효과
		setWindowSize({
			width:window.innerWidth,
			height:window.innerHeight
		})
	});

	useEffect(()=> {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		contextRef.current = context;
		setCtx(context);
		window.addEventListener('resize', onResize);
		return () =>{
			window.removeEventListener('resize',onResize);
		}
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

	function branch(startX,startY,endX,endY,depth,width,angle,cntframe,color){
		if (size === depth) {
			cancelAnimationFrame(branch);
			return;
		}
		if (cntframe === frame ){
			const len = depth == 0 ? random(9,12):random(0,12);
			const nextX:number = endX + cos(angle)*(size-depth)*len;
			const nextY:number = endY + sin(angle)*(size-depth)*len;
			requestAnimationFrame(()=>branch(endX,endY,nextX,nextY,depth+1,width-1,angle+random(12,23),0,color));
			requestAnimationFrame(()=>branch(endX,endY,nextX,nextY,depth+1,width-1,angle-random(12,23),0,color));
		}
		else {
			const gapX = (endX-startX)/frame;
			const gapY = (endY-startY)/frame;
			ctx.beginPath();
			ctx.lineWidth = width;
			ctx.moveTo(startX+gapX*(cntframe),startY+gapY*(cntframe));
			ctx.lineTo(startX+gapX*(cntframe+1),startY+gapY*(cntframe+1));
			if (dark && depth < 3) {
				ctx.fillStyle = '#FFFFFF';
				ctx.strokeStyle = '#FFFFFF';
			}
			else if (dark) {
				ctx.fillStyle = color;
				ctx.strokeStyle = color;
			}
			else {
				ctx.fillStyle = '#000000';
				ctx.strokeStyle = '#000000';
			}
			ctx.stroke();
			requestAnimationFrame(()=>branch(startX,startY,endX,endY,depth,width,angle,cntframe+1,color));
		}
	}
	const drawing = e => {
		const offsetX = e.nativeEvent.offsetX;
		requestAnimationFrame(()=>branch(offsetX,window.innerHeight,offsetX,window.innerHeight,0,size,-90,0,colors[random(0,colors.length)]));
	}
	return(
		<div className={dark?styles.black:styles.white}>
			<div className={dark?styles.DarkMode:styles.WhiteMode} onClick={onDark}>{dark?<BsFillSunFill/>:<BsFillMoonFill/>}</div>
			<canvas className={styles.canvas} ref={canvasRef} width={windowSize.width} height={windowSize.height} onMouseDown={e =>drawing(e)}></canvas>
		</div>
	)
}


export default Canvas;