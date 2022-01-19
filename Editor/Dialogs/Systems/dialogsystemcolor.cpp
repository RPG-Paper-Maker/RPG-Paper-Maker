/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QColorDialog>
#include "dialogsystemcolor.h"
#include "ui_dialogsystemcolor.h"
#include "rpm.h"

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
    this->initialize();
    this->translate();
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

//-------------------------------------------------

void DialogSystemColor::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_COLOR) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->pushButtonColor->setText(RPM::translate(Translations::CHANGE_COLOR) +
        RPM::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
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
