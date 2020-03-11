/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommanddisplaychoice.h"
#include "ui_dialogcommanddisplaychoice.h"
#include "systemlang.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandDisplayChoice::DialogCommandDisplayChoice(EventCommand *command,
    SystemCommonObject *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
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
    QStandardItemModel *properties;
    SystemLang * lang;

    properties = m_object == nullptr ? nullptr : m_object->modelProperties();
    ui->treeViewChoices->setUpdateId(true);
    ui->treeViewChoices->setCanBeEmpty(false);
    ui->treeViewChoices->initializeModel(m_model);
    lang = new SystemLang;
    lang->setDisplayID(false);
    ui->treeViewChoices->initializeNewItemInstance(lang);
    ui->panelPrimitiveCancelAutoIndex->initializeProperty(m_parameters,
        properties, true);
    ui->panelPrimitiveCancelAutoIndex->showNumber();
}

// -------------------------------------------------------

void DialogCommandDisplayChoice::initializeDefault() {
    SystemLang *lang;
    QList<QStandardItem *> row;

    lang = new SystemLang(1, new LangsTranslation("Yes"));
    lang->setDisplayID(false);
    row = lang->getModelRow();
    m_model->appendRow(row);
    lang = new SystemLang(2, new LangsTranslation("No"));
    lang->setDisplayID(false);
    row = lang->getModelRow();
    m_model->appendRow(row);
    m_model->appendRow(SuperListItem::getEmptyItem());
    ui->panelPrimitiveCancelAutoIndex->setNumberValue(2);
}

//-------------------------------------------------

void DialogCommandDisplayChoice::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandDisplayChoice::getCommand() const {
    QVector<QString> command;
    SystemLang *lang;
    int i, l;

    ui->panelPrimitiveCancelAutoIndex->getCommand(command);
    for (i = 0, l = m_model->invisibleRootItem()->rowCount(); i < l; i++) {
        lang = reinterpret_cast<SystemLang *>(m_model->item(i)->data().value<
            quintptr>());
        if (lang != nullptr) {
            command.append(RPM::DASH);
            command.append(QString::number(lang->id()));
            lang->getCommand(command);
        }
    }

    return new EventCommand(EventCommandKind::DisplayChoice, command);
}

// -------------------------------------------------------

void DialogCommandDisplayChoice::initialize(EventCommand *command) {
    SystemLang * lang;
    QList<QStandardItem *> row;
    QString next;
    int i, l, id;

    i = 0;
    l = command->commandsCount();
    ui->panelPrimitiveCancelAutoIndex->initializeCommand(command, i);
    lang = nullptr;
    while (i < l) {
        next = command->valueCommandAt(i);
        if (next == RPM::DASH) {
            id = command->valueCommandAt(++i).toInt();
            if (lang != nullptr) {
                row = lang->getModelRow();
                m_model->appendRow(row);
            }
            lang = new SystemLang(id, new LangsTranslation);
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
