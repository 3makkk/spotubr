import React from 'react';
import {Box, Heading} from 'grommet';


export const Header = () => (
    <Box
        tag='header'
        background='brand'
        pad='small'
        elevation='small'
        justify='between'
        direction='row'
        align='center'
        flex={false}
    >
        <Heading level={3} margin='none'>
            <strong>My App</strong>
        </Heading>
    </Box>
);
