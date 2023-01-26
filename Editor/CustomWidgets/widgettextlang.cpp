/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgettextlang.h"
#include "ui_widgettextlang.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTextLang::WidgetTextLang(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetTextLang),
    m_lang(nullptr)
{
    ui->setupUi(this);
}

WidgetTextLang::~WidgetTextLang()
{
    delete ui;
}

QLineEdit * WidgetTextLang::lineEdit() const
{
    return ui->lineEdit;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTextLang::initializeNamesLang(SystemTranslatable *lang)
{
    m_lang = lang;
    this->initializeNames();
}

// -------------------------------------------------------

void WidgetTextLang::initializeNames()
{
    m_lang->updateNames();
    QString mainName = m_lang->mainName();
    if (m_lang != nullptr)
    {
        m_lang->setName(mainName);
    }
    this->lineEdit()->setText(mainName);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetTextLang::on_lineEdit_textChanged(const QString &text)
{
    if (m_lang != nullptr)
    {
        m_lang->setMainName(text);
    }
    emit mainChanged(text);
}

// -------------------------------------------------------

void WidgetTextLang::on_pushButton_clicked()
{
    if (m_lang != nullptr)
    {
        QString mainName = m_lang->mainName();
        if (m_lang->SystemTranslatable::openDialog())
        {
            QString newMainName = m_lang->mainName();
            if (mainName != newMainName)
            {
                ui->lineEdit->setText(newMainName);
                emit mainChanged(newMainName);
            }
        }
    }
}
