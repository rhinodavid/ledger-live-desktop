// @flow

import React from 'react'
import styled from 'styled-components'
import Ticker from 'react-flip-ticker'

import isUndefined from 'lodash/isUndefined'

import type { Unit } from '@ledgerhq/currencies'

import { formatCurrencyUnit, getFiatUnit } from '@ledgerhq/currencies'

import Box from 'components/base/Box'

import IconBottom from 'icons/Bottom'
import IconTop from 'icons/Top'

const T = styled(Box).attrs({
  ff: 'Rubik',
  horizontal: true,
  color: p =>
    p.withIcon
      ? p.theme.colors.dark
      : p.isNegative
        ? p.theme.colors.alertRed
        : p.theme.colors.positiveGreen,
})`
  line-height: 1.2;
  white-space: pre;
`

const I = ({ color, children }: { color: string, children: any }) => (
  <Box color={color}>{children}</Box>
)

type Props = {
  alwaysShowSign?: boolean,
  animateTicker?: boolean,
  disableRounding?: boolean,
  fiat?: string | null,
  isPercent?: boolean,
  showCode?: boolean,
  unit?: Unit | null,
  val: number,
  withIcon?: boolean,
}

function FormattedVal(props: Props) {
  const {
    animateTicker,
    disableRounding,
    fiat,
    isPercent,
    alwaysShowSign,
    showCode,
    withIcon,
    ...p
  } = props
  let { val, unit } = props

  if (isUndefined(val)) {
    throw new Error('FormattedVal require a `val` prop. Received `undefined`')
  }

  const isNegative = val < 0

  let text = ''

  if (isPercent) {
    text = `${alwaysShowSign ? (isNegative ? '- ' : '+ ') : ''}${isNegative ? val * -1 : val} %`
  } else {
    if (fiat) {
      unit = getFiatUnit(fiat)
    } else if (!unit) {
      return ''
    }

    if (withIcon && isNegative) {
      val *= -1
    }

    text = formatCurrencyUnit(unit, val, {
      alwaysShowSign,
      disableRounding,
      showCode,
    })
  }

  if (animateTicker) {
    text = <Ticker text={text} />
  }

  return (
    <T isNegative={isNegative} withIcon={withIcon} {...p}>
      {withIcon ? (
        <Box horizontal alignItems="center" flow={1}>
          <Box>
            {isNegative ? (
              <I color="alertRed">
                <IconBottom size={16} />
              </I>
            ) : (
              <I color="positiveGreen">
                <IconTop size={16} />
              </I>
            )}
          </Box>
          <Box horizontal alignItems="center">
            {text}
          </Box>
        </Box>
      ) : (
        text
      )}
    </T>
  )
}

FormattedVal.defaultProps = {
  alwaysShowSign: false,
  animateTicker: false,
  disableRounding: false,
  fiat: null,
  isPercent: false,
  showCode: false,
  unit: null,
  withIcon: false,
}

export default FormattedVal