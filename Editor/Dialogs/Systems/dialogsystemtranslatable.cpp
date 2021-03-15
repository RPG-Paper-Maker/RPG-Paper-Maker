/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemtranslatable.h"
#include "ui_dialogsystemtranslatable.h"
#include "systemlanguage.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemTranslatable::DialogSystemTranslatable(SystemTranslatable &model, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemTranslatable),
    m_model(model)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemTranslatable::~DialogSystemTranslatable()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemTranslatable::initialize()
{
    QStandardItemModel *model = RPM::get()->project()->langsDatas()->model();
    QWidget *widget;
    SystemLanguage *language;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        language = reinterpret_cast<SystemLanguage *>(SuperListItem
            ::getItemModelAt(model, i));
        if (language != nullptr)
        {
            //widget = new QWidget(nullptr);
            ui->tabWidget->insertTab(i, widget, language->name());
        }
    }
}

//-------------------------------------------------

void DialogSystemTranslatable::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_NAME) + RPM
        ::DOT_DOT_DOT);
    ui->labelAll->setText(RPM::translate(Translations::ALL) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemTranslatable::on_lineEditAll_textEdited(const QString &text)
{
    m_model.setAllNames(text);
}
