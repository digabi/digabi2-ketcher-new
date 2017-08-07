const initState = {
	errors: {},
	valid: true,
	stateForm: {
		mode: "discard"
	}
};

const dumbActions = [
	'UPDATE_AUTOMAP_FORM'
];

export default function automapReducer(state = initState, action) {

	if (dumbActions.includes(action.type)) {
		return Object.assign({}, state, action.payload);
	}

	return state;
}