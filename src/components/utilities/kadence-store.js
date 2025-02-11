import {createReduxStore, register, createRegistrySelector, createRegistryControl} from '@wordpress/data';

const DEFAULT_STATE = {
	previewDevice: 'Desktop',
};

const actions = {
	*setPreviewDeviceType( deviceType ) {
		const setForCore = yield {
			type: 'SET_PREVIEW_DEVICE_TYPE_FOR_CORE',
			deviceType,
		}

		if ( !setForCore ) {
			return {
				type: 'SET_PREVIEW_DEVICE_TYPE',
				deviceType,
			};
		}
	},
};

const controls = {
	'SET_PREVIEW_DEVICE_TYPE_FOR_CORE': createRegistryControl( ( registry ) => function *setPreviewDeviceTypeForCore( { deviceType } ) {
		const editPost = registry.dispatch( 'core/edit-post' );

		if ( editPost ) {
			yield editPost.__experimentalSetPreviewDeviceType( deviceType );

			return true;
		}

		const editSite = registry.dispatch( 'core/edit-site' );

		if ( editSite ) {
			yield editSite.__experimentalSetPreviewDeviceType( deviceType );

			return true;
		}

		return false;
	} ),
};

const getPreviewDeviceType = createRegistrySelector( ( select ) => ( state ) => {
	const editPost = select( 'core/edit-post' );

	if ( editPost ) {
		return editPost.__experimentalGetPreviewDeviceType();
	}

	const editSite = select( 'core/edit-site' );

	if ( editSite ) {
		return editSite.__experimentalGetPreviewDeviceType();
	}

	return state.previewDevice;
} );

const store = createReduxStore( 'kadenceblocks/data', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_PREVIEW_DEVICE_TYPE':
				return {
					...state,
					previewDevice: action.deviceType,
				};
			default:
				return state;
		}
	},
	actions,
	controls,
	selectors: {
		getPreviewDeviceType,
	},
} );

register( store );