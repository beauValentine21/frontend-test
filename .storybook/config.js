import {configure} from '@storybook/react';

function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
}

function loadStories() {
    requireAll(require.context('../stories', true, /\.(story|stories)\.jsx?$/));
}

configure(loadStories, module);
