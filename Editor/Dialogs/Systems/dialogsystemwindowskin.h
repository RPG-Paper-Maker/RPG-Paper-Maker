/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMWINDOWSKIN_H
#define DIALOGSYSTEMWINDOWSKIN_H

#include <QDialog>
#include "systemwindowskin.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemWindowSkin
//
//  A dialog used for editing the model of a system window skin.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemWindowSkin;
}

class DialogSystemWindowSkin : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemWindowSkin(SystemWindowSkin &windowSkin, QWidget
        *parent = nullptr);
    ~DialogSystemWindowSkin();

private:
    Ui::DialogSystemWindowSkin *ui;
    SystemWindowSkin& m_windowSkin;
    float m_zoom;

    void initialize();
    void updateZoom(int zoom);
    void enableAll(bool b);
    void translate();

    virtual void closeEvent(QCloseEvent *event);

public slots:
    void on_pictureChanged(SystemPicture *picture);
    void on_horizontalSlider_valueChanged(int value);
    void on_comboBoxOptionBackground_currentIndexChanged(int index);
    void on_selecting();
    void on_rectDrawn();
};

#endif // DIALOGSYSTEMWINDOWSKIN_H
