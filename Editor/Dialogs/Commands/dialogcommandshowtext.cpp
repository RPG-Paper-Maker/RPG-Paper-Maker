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
#include "systemfontsize.h"

const QString DialogCommandShowText::TAG_BOLD = "b";
const QString DialogCommandShowText::TAG_ITALIC = "i";
const QString DialogCommandShowText::TAG_LEFT = "l";
const QString DialogCommandShowText::TAG_CENTER = "c";
const QString DialogCommandShowText::TAG_RIGHT = "r";
const QString DialogCommandShowText::TAG_FONT_SIZE = "size";
const QString DialogCommandShowText::TAG_FONT_NAME = "font";
const QString DialogCommandShowText::TAG_TEXT_COLOR = "textcolor";
const QString DialogCommandShowText::TAG_BACK_COLOR = "backcolor";
const QString DialogCommandShowText::TAG_STROKE_COLOR = "strokecolor";
const QString DialogCommandShowText::TAG_VARIABLE = "var";
const QString DialogCommandShowText::TAG_PARAMETER = "par";
const QString DialogCommandShowText::TAG_PROPERTY = "pro";
const QString DialogCommandShowText::TAG_HERO_NAME = "hname";
const QString DialogCommandShowText::TAG_ICON = "ico";

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

    this->translate();
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
    QStandardItemModel *variables;
    int i, l;

    m_parameters = parameters;
    m_properties = object == nullptr ? nullptr : object->modelProperties();
    ui->panelPrimitiveInterlocutor->initializeMessage(false, parameters,
        m_properties);
    m_facesetID = new SuperListItem(-1);
    ui->widgetPictureFaceset->setKind(PictureKind::Facesets);
    ui->widgetPictureFaceset->initializeSuper(m_facesetID);

    // Plain text options
    SuperListItem::fillComboBox(ui->comboBoxFontSize, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelFontSizes());
    SuperListItem::fillComboBox(ui->comboBoxFontName, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelFontNames());
    SuperListItem::fillComboBox(ui->comboBoxTextColor, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), true, false, true);
    SuperListItem::fillComboBox(ui->comboBoxBackColor, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), true, false, true);
    SuperListItem::fillComboBox(ui->comboBoxStrokeColor, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), true, false, true);
    variables = RPM::get()->project()->gameDatas()->variablesDatas()->model();
    for (i = 0, l = variables->invisibleRootItem()->rowCount(); i < l; i++) {
        SuperListItem::fillComboBox(ui->comboBoxVariable, reinterpret_cast<
            SystemVariables *>(variables->item(i)->data().value<quintptr>())
            ->model());
        SuperListItem::fillComboBox(ui->comboBoxHeroName, reinterpret_cast<
            SystemVariables *>(variables->item(i)->data().value<quintptr>())
            ->model());
    }

    if (m_parameters != nullptr) {
        SuperListItem::fillComboBox(ui->comboBoxParameters, m_parameters);
    } else {
        ui->comboBoxParameters->hide();
    }
    if (m_properties != nullptr) {
        SuperListItem::fillComboBox(ui->comboBoxProperties, m_properties);
    } else {
        ui->comboBoxProperties->hide();
    }
    SuperListItem::fillComboBox(ui->comboBoxIcon, RPM::get()->project()
        ->picturesDatas()->model(PictureKind::Icons), true, false, true);
    ui->plainTextMessage->setFocus();
}

// -------------------------------------------------------

void DialogCommandShowText::insertTag(int index, QComboBox *combobox, QString
    tag, QStandardItemModel *model, int modelIndex, bool closure)
{
    if (index > 0) {
        QString text;

        combobox->setCurrentIndex(0);
        text = "[" + tag + "=" + QString::number(reinterpret_cast<SuperListItem
            *>(SuperListItem::getByIndex(model,modelIndex))->id()) + "]";
        if (closure) {
            text += ui->plainTextMessage->textCursor().selectedText() + "[/" +
                tag + "]";
        }
        ui->plainTextMessage->insertPlainText(text);
        ui->plainTextMessage->setFocus();
    }
}

// -------------------------------------------------------

void DialogCommandShowText::insertNoValueTag(QString tag) {
    ui->plainTextMessage->insertPlainText("[" + tag + "]" + ui->plainTextMessage
        ->textCursor().selectedText() + "[/" + tag + "]");
    ui->plainTextMessage->setFocus();
}

//-------------------------------------------------

void DialogCommandShowText::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
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
    command.append(ui->plainTextMessage->toPlainText());

    return new EventCommand(EventCommandKind::ShowText, command);
}

// -------------------------------------------------------

void DialogCommandShowText::initialize(EventCommand* command) {
    int i;

    i = 0;
    ui->panelPrimitiveInterlocutor->initializeCommand(command, i);
    m_facesetID->setId(command->valueCommandAt(i++).toInt());
    ui->widgetPictureFaceset->initializeSuper(m_facesetID);
    ui->plainTextMessage->setPlainText(command->valueCommandAt(i++));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandShowText::on_pushButtonBold_clicked() {
    this->insertNoValueTag(TAG_BOLD);
}

// -------------------------------------------------------

void DialogCommandShowText::on_pushButtonItalic_clicked() {
    this->insertNoValueTag(TAG_ITALIC);
}

// -------------------------------------------------------

void DialogCommandShowText::on_pushButtonLeft_clicked() {
    this->insertNoValueTag(TAG_LEFT);
}

// -------------------------------------------------------

void DialogCommandShowText::on_pushButtonCenter_clicked() {
    this->insertNoValueTag(TAG_CENTER);
}

// -------------------------------------------------------

void DialogCommandShowText::on_pushButtonRight_clicked() {
    this->insertNoValueTag(TAG_RIGHT);
}

// -------------------------------------------------------

void DialogCommandShowText::on_comboBoxFontSize_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxFontSize, TAG_FONT_SIZE, RPM::get()
        ->project()->gameDatas()->systemDatas()->modelFontSizes(), index - 1);
}

// -------------------------------------------------------

void DialogCommandShowText::on_comboBoxFontName_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxFontName, TAG_FONT_NAME, RPM::get()
        ->project()->gameDatas()->systemDatas()->modelFontNames(), index - 1);
}

// -------------------------------------------------------

void DialogCommandShowText::on_comboBoxTextColor_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxTextColor, TAG_TEXT_COLOR, RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), index - 1);
}

// -------------------------------------------------------

void DialogCommandShowText::on_comboBoxBackColor_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxBackColor, TAG_BACK_COLOR, RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), index - 1);
}

// -------------------------------------------------------

void DialogCommandShowText::on_comboBoxStrokeColor_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxStrokeColor, TAG_STROKE_COLOR, RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), index - 1);
}

// -------------------------------------------------------

void DialogCommandShowText::on_comboBoxVariable_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxVariable, TAG_VARIABLE, reinterpret_cast
        <SystemVariables *>(RPM::get()->project()->gameDatas()->variablesDatas()
        ->model()->item((index - 1) / SystemVariables::variablesPerPage)->data()
        .value<quintptr>())->model(), (index - 1) % SystemVariables
        ::variablesPerPage, false);
}

// -------------------------------------------------------

void DialogCommandShowText::on_comboBoxParameters_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxParameters, TAG_PARAMETER, m_parameters,
        index - 1, false);
}

// -------------------------------------------------------

void DialogCommandShowText::on_comboBoxProperties_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxProperties, TAG_PROPERTY, m_properties,
        index - 1, false);
}

// -------------------------------------------------------

void DialogCommandShowText::on_comboBoxHeroName_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxHeroName, TAG_HERO_NAME, reinterpret_cast
        <SystemVariables *>(RPM::get()->project()->gameDatas()->variablesDatas()
        ->model()->item((index - 1) / SystemVariables::variablesPerPage)->data()
        .value<quintptr>())->model(), (index - 1) % SystemVariables
        ::variablesPerPage, false);
}

// -------------------------------------------------------

void DialogCommandShowText::on_comboBoxIcon_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxIcon, TAG_ICON, RPM::get()->project()
        ->picturesDatas()->model(PictureKind::Icons), index - 1, false);
}
