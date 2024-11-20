/****************************************************************************
 * Copyright 2021 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/

import {
  BottomToolbarContainer,
  LeftToolbarContainer,
  RightToolbarContainer,
  TopToolbarContainer,
} from '../views/toolbars';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import AppClipArea from '../views/AppClipArea';
import { AppHiddenContainer } from './AppHidden';
import AppModalContainer from '../views/modal';
import ConnectedEditor from '../views/Editor';
import classes from './App.module.less';
import { initFGroups, initFGTemplates } from '../state/functionalGroups';
import {
  initSaltsAndSolvents,
  initSaltsAndSolventsTemplates,
} from '../state/saltsAndSolvents';
import { useSubscriptionOnEvents } from '../../../hooks';
import { AbbreviationLookupContainer } from '../dialog/AbbreviationLookup';
import { initLib } from '../state/templates/init-lib';
import { load } from '../';

interface AppCallProps {
  checkServer: () => void;
  togglerComponent?: JSX.Element;
}

const muiTheme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

type Props = AppCallProps;

const App = (props: Props) => {
  const dispatch = useDispatch();
  const { checkServer } = props;

  useSubscriptionOnEvents();

  useEffect(() => {
    console.log('App container useEffect');
    const queryParams = new URLSearchParams(window.location.search);
    const filename = queryParams.get('filename') || '';
    console.log('queryParams:', queryParams);
    console.log('filename:', filename);
    const url = `/wd/${encodeURIComponent(filename)}`;
    console.log('url:', url);

    // check if file already exists
    if (filename.length > 0) {
      fetch(url, { method: 'PROPFIND' }).then((result) => {
        switch (result.status) {
          case 207: {
            // The file exists; open the app with its contents.
            fetch(url, { method: 'GET' }).then((contentResponse) => {
              contentResponse.text().then((content) => {
                console.log('content:', content);
                dispatch(
                  load(content, {
                    badHeaderRecover: true,
                    fragment: undefined, // TODO - what is this?
                    'input-format': undefined, // TODO - also this,
                  }),
                  // TODO: Removed ownProps.onOk call. consider refactoring of load function in release 2.4
                  // See PR #731 (https://github.com/epam/ketcher/pull/731)
                );
              });
            });
            break;
          }
          case 404: {
            // No such file; it will be created when first saved.
            // POST filename to url
            fetch(url, {
              method: 'PUT',
            })
              .then((response) => response.text())
              .then((data) => {
                console.log('Success:', data);
              })
              .catch((error) => {
                console.error('Error:', error);
              });
            break;
          }
          default: {
            // An error happened; do not start the app.
          }
        }
      });
    }

    checkServer();
    dispatch(initFGTemplates());
    dispatch(initSaltsAndSolventsTemplates());
    window.scrollTo(0, 0);
    return () => {
      dispatch(initLib([]));
      dispatch(initSaltsAndSolvents([]));
      dispatch(initFGroups([]));
    };
  }, []);

  // Temporary workaround: add proper types for Editor
  const Editor = ConnectedEditor as React.ComponentType<{ className: string }>;

  return (
    <ThemeProvider theme={muiTheme}>
      <div className={classes.app}>
        <AppHiddenContainer />
        <Editor className={classes.canvas} />

        <TopToolbarContainer
          className={classes.top}
          togglerComponent={props.togglerComponent}
        />
        <LeftToolbarContainer className={classes.left} />
        <BottomToolbarContainer className={classes.bottom} />
        <RightToolbarContainer className={classes.right} />

        <AppClipArea />
        <AppModalContainer />
        <AbbreviationLookupContainer />
      </div>
    </ThemeProvider>
  );
};

export type { AppCallProps };
export { App };
