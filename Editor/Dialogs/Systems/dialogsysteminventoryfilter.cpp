/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsysteminventoryfilter.h"
#include "ui_dialogsysteminventoryfilter.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemInventoryFilter::DialogSystemInventoryFilter(SystemInventoryFilter
    &inventoryFilter, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemInventoryFilter),
    m_inventoryFilter(inventoryFilter)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemInventoryFilter::~DialogSystemInventoryFilter()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemInventoryFilter::initialize()
{
    this->setVisibleCustom(false);
    this->setVisibleScript(false);
    ui->widgetTextLangName->initializeNamesLang(&m_inventoryFilter);
    int index = static_cast<int>(m_inventoryFilter.kind());
    ui->comboBoxKind->addItems(RPM::ENUM_TO_STRING_INVENTORY_FILTER_KIND);
    ui->comboBoxKind->setCurrentIndex(index);
    if (m_inventoryFilter.kind() == InventoryFilterKind::Custom) {
        this->setVisibleCustom(true);
    }
    ui->panelPrimitiveItemTypeID->initializeDataBaseAndUpdate(m_inventoryFilter.itemTypeID());
    if (m_inventoryFilter.kind() == InventoryFilterKind::Script) {
        this->setVisibleScript(true);
    }
    ui->plainTextScript->setPlainText(m_inventoryFilter.script());
}

// -------------------------------------------------------

void DialogSystemInventoryFilter::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_INVENTORY_FILTER) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelKind->setText(RPM::translate(Translations::KIND) + RPM::COLON);
    ui->labelItemTypeID->setText(RPM::translate(Translations::ITEM_TYPE_ID) + RPM::COLON);
    ui->labelScript->setText(RPM::translate(Translations::SCRIPT) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------

void DialogSystemInventoryFilter::setVisibleCustom(bool b)
{
    ui->labelItemTypeID->setVisible(b);
    ui->panelPrimitiveItemTypeID->setVisible(b);
}

// -------------------------------------------------------

void DialogSystemInventoryFilter::setVisibleScript(bool b)
{
    ui->labelScript->setVisible(b);
    ui->plainTextScript->setVisible(b);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemInventoryFilter::on_comboBoxKind_currentIndexChanged(int index)
{
    m_inventoryFilter.setKind(static_cast<InventoryFilterKind>(index));
    this->setVisibleCustom(false);
    this->setVisibleScript(false);

    switch (m_inventoryFilter.kind())
    {
    case InventoryFilterKind::Custom:
        this->setVisibleCustom(true);
        break;
    case InventoryFilterKind::Script:
        this->setVisibleScript(true);
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void DialogSystemInventoryFilter::on_plainTextScript_textChanged()
{
    m_inventoryFilter.setScript(ui->plainTextScript->toPlainText());
}
