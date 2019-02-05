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

    virtual void closeEvent(QCloseEvent *event);

public slots:
    void on_pictureChanged(SystemPicture *picture);
    void on_horizontalSlider_valueChanged(int value);
    void on_comboBoxOptionBackground_currentIndexChanged(int index);
    void on_selecting();
    void on_rectDrawn();
};

#endif // DIALOGSYSTEMWINDOWSKIN_H
