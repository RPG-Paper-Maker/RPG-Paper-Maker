/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommanddisplaychoice.h"
#include "ui_dialogcommanddisplaychoice.h"
#include "systemtranslatable.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandDisplayChoice::DialogCommandDisplayChoice(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    m_model(new QStandardItemModel),
    ui(new Ui::DialogCommandDisplayChoice)
{
    ui->setupUi(this);

    this->initializePrimitives();
    if (command != nullptr) {
        this->initialize(command);
    } else {
        this->initializeDefault();
    }

    this->translate();
}

DialogCommandDisplayChoice::~DialogCommandDisplayChoice() {
    SuperListItem::deleteModel(m_model);

    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandDisplayChoice::initializePrimitives() {
    SystemTranslatable * lang;

    ui->treeViewChoices->setUpdateId(true);
    ui->treeViewChoices->setCanBeEmpty(false);
    ui->treeViewChoices->initializeModel(m_model);
    lang = new SystemTranslatable;
    lang->setDisplayID(false);
    ui->treeViewChoices->initializeNewItemInstance(lang);
    ui->panelPrimitiveCancelAutoIndex->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveMaxNumberChoicesDisplay->initializeNumber(m_parameters, m_properties);
}

// -------------------------------------------------------

void DialogCommandDisplayChoice::initializeDefault() {
    SystemTranslatable *lang;
    QList<QStandardItem *> row;

    lang = new SystemTranslatable(1, RPM::translate(Translations::YES));
    lang->setDisplayID(false);
    row = lang->getModelRow();
    m_model->appendRow(row);
    lang = new SystemTranslatable(2, RPM::translate(Translations::NO));
    lang->setDisplayID(false);
    row = lang->getModelRow();
    m_model->appendRow(row);
    m_model->appendRow(SuperListItem::getEmptyItem());
    ui->panelPrimitiveCancelAutoIndex->setNumberValue(2);
    ui->panelPrimitiveMaxNumberChoicesDisplay->setNumberValue(5);
}

//-------------------------------------------------

void DialogCommandDisplayChoice::translate()
{
    this->setWindowTitle(RPM::translate(Translations::DISPLAY_CHOICES) + RPM
        ::DOT_DOT_DOT);
    ui->labelCancelAutoIndex->setText(RPM::translate(Translations
        ::CANCEL_AUTO_INDEX) + RPM::COLON);
    ui->labelMaxNumberChoicesDisplay->setText(RPM::translate(Translations
        ::MAX_NUMBER_CHOICES_DISPLAY) + RPM::COLON);
    ui->groupBoxChoices->setTitle(RPM::translate(Translations::CHOICES));
    ui->groupBoxOptions->setTitle(RPM::translate(Translations::OPTIONS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandDisplayChoice::getCommand() const {
    QVector<QString> command;
    SystemTranslatable *lang;
    int i, l;

    ui->panelPrimitiveCancelAutoIndex->getCommand(command);
    ui->panelPrimitiveMaxNumberChoicesDisplay->getCommand(command);
    for (i = 0, l = m_model->invisibleRootItem()->rowCount(); i < l; i++) {
        lang = reinterpret_cast<SystemTranslatable *>(m_model->item(i)->data().value<
            quintptr>());
        if (lang != nullptr) {
            command.append(RPM::DASH);
            lang->getCommand(command);
        }
    }

    return new EventCommand(EventCommandKind::DisplayChoice, command);
}

// -------------------------------------------------------

void DialogCommandDisplayChoice::initialize(EventCommand *command) {
    SystemTranslatable * lang;
    QList<QStandardItem *> row;
    QString next;
    int i, l;

    i = 0;
    l = command->commandsCount();
    ui->panelPrimitiveCancelAutoIndex->initializeCommand(command, i);
    ui->panelPrimitiveMaxNumberChoicesDisplay->initializeCommand(command, i);
    lang = nullptr;
    while (i < l) {
        next = command->valueCommandAt(i);
        if (next == RPM::DASH) {
            if (lang != nullptr) {
                row = lang->getModelRow();
                m_model->appendRow(row);
            }
            lang = new SystemTranslatable(-1, "");
            lang->setDisplayID(false);
            i++;
        }
        lang->initializeCommand(command, i);
    }
    if (lang != nullptr) {
        row = lang->getModelRow();
        m_model->appendRow(row);
    }
    m_model->appendRow(SuperListItem::getEmptyItem());
}
