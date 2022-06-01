import "./app.css"
import * as React from 'react'
import Map, {Marker, Popup} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {Room, Star} from "@material-ui/icons"	
import axios from "axios"
import {format} from "timeago.js"
import Register from "./components/Register"
import Login from "./components/Login"

function App() {
	const myStorage = window.localStorage
	const [currentUser,setCurrentUser] = React.useState(myStorage.getItem('user'))
	const [pins, setPins] = React.useState([])
	const [currentPlaceId, setCurrentPlaceId] = React.useState(null)
	const [newPlace, setNewPlace] = React.useState(null)
	const [title, setTitle] = React.useState(null)
	const [desc, setDesc] = React.useState(null)
	const [rating, setRating] = React.useState(0)
	const [showRegister, setShowRegister] = React.useState(false)
	const [showLogin, setShowLogin] = React.useState(false)
 	const [viewState, setViewState] = React.useState({
		longitude: 17,
		latitude: 46,
		zoom: 4
	})

	React.useEffect(() => {
		const getPins = async ()=> {
			try {
				const allPins = await axios.get("/api/pins")
				setPins(allPins.data)
			} catch (err) {
				console.log(err)
			}
		}
		getPins()
	}, [])


	const handleMarkerClick = (id,lat,long) => {
		setCurrentPlaceId(id)
		setViewState({...viewState, latitude: lat, longtitude: long})
	}

	const handleDblClick = (e) => {
		const latitude = e.lngLat['lat']
		const longtitude = e.lngLat['lng']
		setNewPlace({
			lat: latitude,
			long: longtitude,
		})
	}
 	const handleSubmit = async (e) => {
		e.preventDefault()
		const newPin = {
			username:currentUser,
			title,
			desc,
			rating,
			lat: newPlace.lat,
			long: newPlace.long
		}

		try {
			const res = await axios.post('/api/pins', newPin)
			setPins([...pins, res.data])
			setNewPlace(null)
		} catch(err){
			console.log(err)
		}
	}

	const handleLogout = () => {
		myStorage.removeItem('user')
		setCurrentUser(null)
	}
	return (
		<div style={{ height: "100vh", width: "100%" }}>
			<Map
				{...viewState}
				onMove={evt => setViewState(evt.viewState)}
				style={{width: "100vw", height: "100vh"}}
				mapStyle="mapbox://styles/ntkhang2003/cl2u4h7h9003q14qlg5xxzdh7"
				mapboxAccessToken={process.env.REACT_APP_MAPBOX}
				onDblClick={handleDblClick}
				transitionDuration="200"
			>
					{pins.map(p => (
				<>
					<Marker
						latitude={p.lat}
						longitude={p.long}
						offsetLeft={-3.5 * viewState.zoom}
						offsetTop={-7 * viewState.zoom}
					>
					<Room
						style={{
							fontSize: 7 * viewState.zoom,
							color: currentUser === p.username ? "tomato" : "slateblue",
							cursor: "pointer",
						}}
						onClick={() => handleMarkerClick(p._id,p.lat,p.long)}
					/>
					</Marker>
					{p._id === currentPlaceId && (
						<Popup
							key={p._id}
							latitude={p.lat}
							longitude={p.long}
							closeButton={true}
							closeOnClick={false}
							onClose={() => setCurrentPlaceId(null)}
							anchor="left"
						>
							<div className="card">
							<label>Place</label>
							<h4 className="place">{p.title}</h4>
							<label>Review</label>
							<p className="desc">{p.desc}</p>
							<label>Rating</label>
							<div className="stars">
								{Array(p.rating).fill(<Star className="star" />)}	
							</div>
							<label>Information</label>
							<span className="username">
								Created by <b>{p.username}</b>
							</span>
							<span className="date">{format(p.createdAt)}</span>
							</div>
						</Popup>
					)}
				</>
			))}
			{newPlace && 
				<Popup
					latitude={newPlace.lat}
					longitude={newPlace.long}
					closeButton={true}
					closeOnClick={false}
					onClose={() => setNewPlace(null)}
					anchor="left"
				>
					<div>
						<form onSubmit={handleSubmit}>
							<label>Title</label>
							<input 
								placeholder="Enter a title" 
								onChange={(e) => setTitle(e.target.value)}
							/>
							<label>Review</label>
							<textarea 
								placeholder="Say us something about this place"
								onChange={(e) => setDesc(e.target.value)}
							/>
							<label onChange={(e) => setRating(e.target.value)}>Rating</label>
							<select>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
							</select>
							<button className="submitButton" type="submit">Add Pin</button>
						</form>
					</div>
				</Popup>
			}
			{currentUser ? (
				<button className="button logout" onClick={handleLogout}>Logout</button>
			) : (<div className="buttons">
					<button className="button login" onClick={() => setShowLogin(true)}>Login</button>
					<button className="button register" onClick={() => setShowRegister(true)}>Register</button>
				</div>
			)}
			{showRegister && <Register setShowRegister={setShowRegister}/>}
			{showLogin && <Login 
				setShowLogin={setShowLogin} 
				myStorage={myStorage} 
				setCurrentUser={setCurrentUser}/>
			}
			</Map>
		</div>
		
	)
}
export default App;