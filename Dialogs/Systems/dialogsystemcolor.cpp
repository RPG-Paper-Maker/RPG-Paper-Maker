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

#include <QColorDialog>
#include "dialogsystemcolor.h"
#include "ui_dialogsystemcolor.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemColor::DialogSystemColor(SystemColor& color, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemColor),
    m_color(color)
{
    ui->setupUi(this);

    initialize();
}

DialogSystemColor::~DialogSystemColor()
{
    delete ui;
}

SystemColor& DialogSystemColor::color() const {
    return m_color;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemColor::initialize(){
    ui->lineEditColor->setText(m_color.name());
    QColor color = m_color.color();
    setBackgroundColor(color);
}

// -------------------------------------------------------

void DialogSystemColor::setBackgroundColor(QColor& color) {
    ui->widgetColor->setStyleSheet("background-color:rgba(" + QString::number(
        color.red()) + "," + QString::number(color.green()) + "," +
        QString::number(color.blue()) + "," + QString::number(color.alpha()) +
        ");");
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemColor::on_lineEditColor_textChanged(const QString &text) {
    m_color.setName(text);
}

// -------------------------------------------------------

void DialogSystemColor::on_pushButtonColor_clicked(bool) {
    QColorDialog dialog;
    dialog.setCurrentColor(m_color.color());
    if (dialog.exec() == QDialog::Accepted) {
        QColor color = dialog.currentColor();
        m_color.setColor(color);
        setBackgroundColor(color);
    }
}
