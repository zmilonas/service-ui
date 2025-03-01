/*
 * Copyright 2021 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import Parser from 'html-react-parser';
import CloseIcon from 'common/img/cross-icon-inline.svg';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './modalHeader.scss';

const cx = classNames.bind(styles);

export const ModalHeader = ({ text, onClose, renderHeaderElements }) => (
  <div className={cx('header')}>
    <div className={cx('header-content')}>
      <span className={cx('title')}>{text}</span>
      <div className={cx('header-elements')}>{renderHeaderElements()}</div>
    </div>
    <div className={cx('close-icon')} onClick={onClose}>
      <span className={cx('close-icon-prefix')}>Esc</span>
      {Parser(CloseIcon)}
    </div>
  </div>
);
ModalHeader.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onClose: PropTypes.func,
  renderHeaderElements: PropTypes.func,
};
ModalHeader.defaultProps = {
  text: '',
  onClose: () => {},
  renderHeaderElements: () => {},
};
