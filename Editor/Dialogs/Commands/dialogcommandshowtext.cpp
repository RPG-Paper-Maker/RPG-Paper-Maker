/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandshowtext.h"
#include "ui_dialogcommandshowtext.h"
#include "eventcommandkind.h"
#include "rpm.h"
#include "systemvariables.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandShowText::DialogCommandShowText(EventCommand *command,
    SystemCommonObject *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandShowText)
{
    ui->setupUi(this);
    
    this->initializeWidgets(object, parameters);
    if (command != nullptr) {
        this->initialize(command);
    }
}

DialogCommandShowText::~DialogCommandShowText() {
    delete ui;

    delete m_facesetID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandShowText::initializeWidgets(SystemCommonObject *object,
    QStandardItemModel *parameters)
{
    QStandardItemModel *properties, *variables;
    int i, l;

    properties = object == nullptr ? nullptr : object->modelProperties();
    ui->panelPrimitiveInterlocutor->initializeMessage(false, parameters,
        properties);
    m_facesetID = new SuperListItem(-1);
    ui->widgetPictureFaceset->setKind(PictureKind::Facesets);
    ui->widgetPictureFaceset->initializeSuper(m_facesetID);

    // Plain text options
    SuperListItem::fillComboBox(ui->comboBoxFontSize, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelFontSizes(), false, true);
    SuperListItem::fillComboBox(ui->comboBoxFontName, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelFontNames(), false, true);
    SuperListItem::fillComboBox(ui->comboBoxTextColor, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), false, true, true);
    SuperListItem::fillComboBox(ui->comboBoxBackColor, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), false, true, true);
    SuperListItem::fillComboBox(ui->comboBoxStrokeColor, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), false, true, true);
    variables = RPM::get()->project()->gameDatas()->variablesDatas()->model();
    for (i = 0, l = variables->invisibleRootItem()->rowCount(); i < l; i++) {
        SuperListItem::fillComboBox(ui->comboBoxVariable, reinterpret_cast<
            SystemVariables *>(variables->item(i)->data().value<quintptr>())
            ->model());
    }

    if (parameters != nullptr) {
        SuperListItem::fillComboBox(ui->comboBoxParameter, parameters, false,
            true);
    }
    if (properties != nullptr) {
        SuperListItem::fillComboBox(ui->comboBoxProperty, properties, false,
            true);
    }
    SuperListItem::fillComboBox(ui->comboBoxIcon, RPM::get()->project()
        ->picturesDatas()->model(PictureKind::Icons), false, true, true);

    ui->panelPrimitiveText->initializeMessage(false, parameters, properties,
        false);
    ui->panelPrimitiveText->showVariable();
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandShowText::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveInterlocutor->getCommand(command);
    command.append(QString::number(m_facesetID->id()));
    command.append(ui->checkBoxUse->isChecked() ? RPM::TRUE_BOOL_STRING : RPM
        ::FALSE_BOOL_STRING);
    if (ui->checkBoxUse->isChecked()) {
        ui->panelPrimitiveText->getCommand(command);
    } else {
        command.append(ui->plainTextMessage->toPlainText());
    }

    return new EventCommand(EventCommandKind::ShowText, command);
}

// -------------------------------------------------------

void DialogCommandShowText::initialize(EventCommand* command) {
    int i;

    i = 0;
    ui->panelPrimitiveInterlocutor->initializeCommand(command, i);
    m_facesetID->setId(command->valueCommandAt(i++).toInt());
    ui->widgetPictureFaceset->initializeSuper(m_facesetID);
    ui->checkBoxUse->setChecked(command->valueCommandAt(i++) == RPM
        ::TRUE_BOOL_STRING ? true : false);
    if (ui->checkBoxUse->isChecked()) {
        ui->panelPrimitiveText->initializeCommand(command, i);
    } else {
        ui->plainTextMessage->setPlainText(command->valueCommandAt(i++));
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandShowText::on_checkBoxUse_toggled(bool checked) {
    ui->pushButtonBold->setEnabled(!checked);
    ui->pushButtonItalic->setEnabled(!checked);
    ui->pushButtonLeft->setEnabled(!checked);
    ui->pushButtonCenter->setEnabled(!checked);
    ui->pushButtonRight->setEnabled(!checked);
    ui->plainTextMessage->setEnabled(!checked);
    ui->comboBoxFontSize->setEnabled(!checked);
    ui->comboBoxFontName->setEnabled(!checked);
    ui->comboBoxTextColor->setEnabled(!checked);
    ui->comboBoxBackColor->setEnabled(!checked);
    ui->comboBoxStrokeColor->setEnabled(!checked);
    ui->comboBoxVariable->setEnabled(!checked);
    ui->comboBoxParameter->setEnabled(!checked);
    ui->comboBoxProperty->setEnabled(!checked);
    ui->comboBoxIcon->setEnabled(!checked);
    ui->panelPrimitiveText->setEnabled(checked);
}
