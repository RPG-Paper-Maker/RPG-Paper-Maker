/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
