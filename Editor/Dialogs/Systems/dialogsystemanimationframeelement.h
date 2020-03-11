/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMANIMATIONFRAMEELEMENT_H
#define DIALOGSYSTEMANIMATIONFRAMEELEMENT_H

#include <QDialog>
#include "systemanimationframeelement.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemAnimationFrameElement
//
//  A dialog used for editing an animation frame element system.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemAnimationFrameElement;
}

class DialogSystemAnimationFrameElement : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemAnimationFrameElement(SystemAnimationFrameElement
        &element, QWidget *parent = nullptr);
    ~DialogSystemAnimationFrameElement();

private:
    Ui::DialogSystemAnimationFrameElement *ui;
    SystemAnimationFrameElement &m_element;

    void initialize();
    void translate();

public slots:
    void on_spinBoxIndex_valueChanged(int i);
    void on_spinBoxX_valueChanged(int i);
    void on_spinBoxY_valueChanged(int i);
    void on_doubleSpinBoxZoom_valueChanged(double d);
    void on_doubleSpinBoxAngle_valueChanged(double d);
    void on_checkBoxFlipVerticaly_toggled(bool checked);
    void on_doubleSpinBoxOpacity_valueChanged(double d);
};

#endif // DIALOGSYSTEMANIMATIONFRAMEELEMENT_H
