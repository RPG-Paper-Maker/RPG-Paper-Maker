/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
