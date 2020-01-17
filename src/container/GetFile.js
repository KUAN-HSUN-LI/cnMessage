import React, { useEffect } from 'react';
import { useSubscription } from 'react-apollo';
import { FILE_SUBSCRIPTION } from '../graphql';
import fileDownload from 'react-file-download';

const GetFile = props => {
	const { name, msgBoxId } = props;
	// const [scribe, setScribe] = useState(false);
	const test = useSubscription(FILE_SUBSCRIPTION, { variables: { msgBoxId: msgBoxId, reciever: name } });

	// if (test.data && !scribe) {
	// 	var { stream, filename, mimetype, encoding } = test.data.file.data;
	// 	var output = Buffer.from(stream, 'base64');
	// 	console.log(test);
	// 	fileDownload(output, filename, mimetype);
	// 	setScribe(true);
	// }

	useEffect(() => {
		if (test.data) {
			var { stream, filename, mimetype } = test.data.file.data;
			var output = Buffer.from(stream, 'base64');
			fileDownload(output, filename, mimetype);
		}
	}, [test.data]);
	return <></>;
};

export default GetFile;
