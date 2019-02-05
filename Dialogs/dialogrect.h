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

#ifndef DIALOGRECT_H
#define DIALOGRECT_H

#include <QDialog>
#include <QLabel>

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
    explicit DialogRect(QRectF *rect, bool controlSquare = true, QWidget *parent
        = nullptr);
    ~DialogRect();

private:
    Ui::DialogRect *ui;
    QRectF *m_rect;
    bool m_controlSquare;

    void updateValues();
    int translateToSpinValue(float percent);
    float translateFromSpinValue(int px);
    int getOne();
    int getTwo();

private slots:
    void on_spinBoxX_valueChanged(int i);
    void on_spinBoxY_valueChanged(int i);
    void on_spinBoxWidth_valueChanged(int i);
    void on_spinBoxHeight_valueChanged(int i);
};

#endif // DIALOGRECT_H
