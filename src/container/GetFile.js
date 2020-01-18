import React, { useEffect } from 'react';
import { useSubscription } from 'react-apollo';
import { FILE_SUBSCRIPTION } from '../graphql';
import fileDownload from 'react-file-download';

const GetFile = props => {
	const { name, msgBoxId } = props;
	const test = useSubscription(FILE_SUBSCRIPTION, { variables: { msgBoxId: msgBoxId, reciever: name } });

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
