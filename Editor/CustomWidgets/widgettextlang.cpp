/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    m_l(nullptr),
    m_lang(nullptr)
{
    ui->setupUi(this);
}

WidgetTextLang::~WidgetTextLang()
{
    delete ui;
}

QLineEdit* WidgetTextLang::lineEdit() const { return ui->lineEdit; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTextLang::initializeNamesTrans(LangsTranslation *l) {
    m_l = l;

    initializeNames();
}

// -------------------------------------------------------

void WidgetTextLang::initializeNamesLang(SystemLang *lang) {
    m_lang = lang;
    m_l = lang->names();

    initializeNames();
}

// -------------------------------------------------------

void WidgetTextLang::initializeNames() {
    QString mainName;
    m_l->updateNames();
    mainName = m_l->mainName();
    if (m_lang != nullptr) {
        m_lang->setName(mainName);
    }

    lineEdit()->setText(mainName);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetTextLang::on_lineEdit_textChanged(const QString &text) {
    if (m_lang != nullptr) {
        m_lang->setName(text);
    }
    m_l->setMainName(text);

    emit mainChanged(text);
}
