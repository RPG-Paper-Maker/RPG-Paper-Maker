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

#ifndef WIDGETICON_H
#define WIDGETICON_H

#include <QWidget>
#include "systemicon.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS WidgetIcon
//
//  A widget used for updating an icon with a preview.
//
// -------------------------------------------------------

namespace Ui {
class WidgetIcon;
}

class WidgetIcon : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetIcon(QWidget *parent = nullptr);
    ~WidgetIcon();

    void initializeIcon(SystemIcon *icon);

private:
    Ui::WidgetIcon *ui;

protected:
    SystemIcon *m_icon;

public slots:
    void on_pictureChanged(SystemPicture *picture);
};

#endif // WIDGETICON_H
