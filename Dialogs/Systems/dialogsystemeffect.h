/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef DIALOGSYSTEMEFFECT_H
#define DIALOGSYSTEMEFFECT_H

#include <QDialog>
#include "systemeffect.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemEffect
//
//  A dialog used for editing the model of a system effect.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemEffect;
}

class DialogSystemEffect : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemEffect(SystemEffect &effect, QWidget *parent = nullptr);
    ~DialogSystemEffect();
    SystemEffect & effect() const;

private:
    Ui::DialogSystemEffect *ui;
    SystemEffect &m_effect;

    void initialize();
    void setElementEnabled(bool checked);
    void setVarianceEnabled(bool checked);
    void setCriticalEnabled(bool checked);
    void setPrecisionEnabled(bool checked);

public slots:
    void on_radioButtonDamages_toggled(bool checked);
    void on_radioButtonStatus_toggled(bool checked);
    void on_radioButtonAddRemoveSkill_toggled(bool checked);
    void on_radioButtonPerformSkill_toggled(bool checked);
    void on_radioButtonCallCommonReaction_toggled(bool checked);
    void on_radioButtonSpecialAction_toggled(bool checked);
    void on_radioButtonScript_toggled(bool checked);
    void on_checkBoxElementID_toggled(bool checked);
    void on_checkBoxVariance_toggled(bool checked);
    void on_checkBoxCritical_toggled(bool checked);
    void on_checkBoxPrecision_toggled(bool checked);
    void on_comboBoxAddRemoveStatus_currentIndexChanged(int index);
    void on_comboBoxAddRemoveSkill_currentIndexChanged(int index);
    void on_comboBoxSpecialAction_currentIndexChanged(int index);
};

#endif // DIALOGSYSTEMEFFECT_H
