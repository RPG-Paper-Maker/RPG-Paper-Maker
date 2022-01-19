/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void translate();

private slots:
    void on_spinBoxX_valueChanged(int i);
    void on_spinBoxY_valueChanged(int i);
    void on_spinBoxWidth_valueChanged(int i);
    void on_spinBoxHeight_valueChanged(int i);
};

#endif // DIALOGRECT_H
