/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMANIMATIONFRAMEEFFECT_H
#define DIALOGSYSTEMANIMATIONFRAMEEFFECT_H

#include <QDialog>
#include "systemanimationframeeffect.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemAnimationFrameEffect
//
//  A dialog used for editing an animation frame effect system.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemAnimationFrameEffect;
}

class DialogSystemAnimationFrameEffect : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemAnimationFrameEffect(SystemAnimationFrameEffect &effect
        , QWidget *parent = nullptr);
    ~DialogSystemAnimationFrameEffect();

private:
    Ui::DialogSystemAnimationFrameEffect *ui;
    SystemAnimationFrameEffect &m_effect;

    void initialize();
    void translate();

public slots:
    void on_radioButtonSoundEffect_toggled(bool checked);
    void on_radioButtonFlash_toggled(bool checked);
    void on_pushButtonFlash_clicked();
    void on_comboBoxCondition_currentIndexChanged(int index);
};

#endif // DIALOGSYSTEMANIMATIONFRAMEEFFECT_H
