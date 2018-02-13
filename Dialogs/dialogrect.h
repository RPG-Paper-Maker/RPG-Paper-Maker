/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef DIALOGRECT_H
#define DIALOGRECT_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogRect
//
//  Dialog for direct redimension a rectangle.
//
// -------------------------------------------------------

namespace Ui {
class DialogRect;
}

class DialogRect : public QDialog
{
    Q_OBJECT

public:
    explicit DialogRect(QRect *rect, QWidget *parent = 0);
    ~DialogRect();

private:
    Ui::DialogRect *ui;
    QRect* m_rect;

    void updateValues();

private slots:
    void on_spinBoxX_valueChanged(int i);
    void on_spinBoxY_valueChanged(int i);
    void on_spinBoxWidth_valueChanged(int i);
    void on_spinBoxHeight_valueChanged(int i);
};

#endif // DIALOGRECT_H
