import React, { FormEvent, useEffect, useRef, useState } from 'react';
// @ts-ignore
import { Chart } from 'react-charts';
import { Tick } from './types';

interface MyChartProps {
	data: Tick[];
}

const getUnixMinus = (minutes: number) => Date.now() - minutes * 60 * 1000;

const MyChart: React.FC<MyChartProps> = ({ data }) => {
	const myInput = useRef(null);
	const [minutes, setMinutes] = useState(20);
	const [askArr, setAskArr] = useState<number[][]>([[1, 1]]);

	useEffect(() => {
		const askArrTemp: number[][] = [];

		data.forEach(({ timestamp, bid, ask }) => {
			const ts = getUnixMinus(minutes);
			if (timestamp < ts) {
				return;
			}
			// bidArr.push([timestamp - ts, bid]);
			askArrTemp.push([(timestamp - ts) / 1000, ask]);
		});
		setAskArr(askArrTemp);
	}, [minutes, setMinutes]);

	if (!askArr) {
		console.log('fuck');
		return null;
	}
	const axes = [
		{ primary: true, type: 'linear', position: 'bottom' },
		{ type: 'linear', position: 'left' },
	];
	const data2 = [
		{
			label: 'Ask',
			data: askArr,
		},
	];

	const onSet = (e: FormEvent) => {
		e.preventDefault();
		if (myInput && myInput.current !== null) {
			// @ts-ignore
			const val = myInput.current.value;
			setMinutes(val);
		}
	};

	return (
		<div
			style={{
				width: '100%',
				height: '300px',
			}}
		>
			<form onSubmit={onSet}>
				<input ref={myInput} type="number" />
				<button onClick={onSet}>Set</button>
			</form>
			<Chart axes={axes} data={data2} />
		</div>
	);
};

export default MyChart;
