/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogpicturespreview.h"
#include "widgetcomplexmessage.h"
#include "ui_widgetcomplexmessage.h"
#include "systemvariables.h"
#include "rpm.h"

const QString WidgetComplexMessage::TAG_BOLD = "b";
const QString WidgetComplexMessage::TAG_ITALIC = "i";
const QString WidgetComplexMessage::TAG_LEFT = "l";
const QString WidgetComplexMessage::TAG_CENTER = "c";
const QString WidgetComplexMessage::TAG_RIGHT = "r";
const QString WidgetComplexMessage::TAG_FONT_SIZE = "size";
const QString WidgetComplexMessage::TAG_FONT_NAME = "font";
const QString WidgetComplexMessage::TAG_TEXT_COLOR = "textcolor";
const QString WidgetComplexMessage::TAG_BACK_COLOR = "backcolor";
const QString WidgetComplexMessage::TAG_STROKE_COLOR = "strokecolor";
const QString WidgetComplexMessage::TAG_VARIABLE = "var";
const QString WidgetComplexMessage::TAG_PARAMETER = "par";
const QString WidgetComplexMessage::TAG_PROPERTY = "pro";
const QString WidgetComplexMessage::TAG_HERO_NAME = "hname";
const QString WidgetComplexMessage::TAG_ICON = "ico";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetComplexMessage::WidgetComplexMessage(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetComplexMessage)
{
    ui->setupUi(this);
    this->translate();
}

WidgetComplexMessage::~WidgetComplexMessage()
{
    delete ui;
}

QString WidgetComplexMessage::text() const
{
    return ui->plainTextMessage->toPlainText();
}

void WidgetComplexMessage::setText(QString text)
{
    ui->plainTextMessage->setPlainText(text);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetComplexMessage::initializeWidgets(QStandardItemModel *properties,
    QStandardItemModel *parameters)
{
    m_properties = properties;
    m_parameters = parameters;
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
    QStandardItemModel *variables = RPM::get()->project()->gameDatas()
        ->variablesDatas()->model();
    for (int i = 0, l = variables->invisibleRootItem()->rowCount(); i < l; i++)
    {
        SuperListItem::fillComboBox(ui->comboBoxVariable, reinterpret_cast<
            SystemVariables *>(variables->item(i)->data().value<quintptr>())
            ->model());
        SuperListItem::fillComboBox(ui->comboBoxHeroName, reinterpret_cast<
            SystemVariables *>(variables->item(i)->data().value<quintptr>())
            ->model());
    }

    if (parameters != nullptr)
    {
        SuperListItem::fillComboBox(ui->comboBoxParameters, parameters);
    } else
    {
        ui->comboBoxParameters->hide();
    }
    if (properties != nullptr)
    {
        SuperListItem::fillComboBox(ui->comboBoxProperties, properties);
    } else
    {
        ui->comboBoxProperties->hide();
    }
    ui->plainTextMessage->setFocus();
}

// -------------------------------------------------------

void WidgetComplexMessage::insertTag(int index, QComboBox *combobox, QString
    tag, QStandardItemModel *model, int modelIndex, bool closure)
{
    if (index > 0)
    {
        combobox->setCurrentIndex(0);
        QString text = "[" + tag + "=" + QString::number(reinterpret_cast<
            SuperListItem *>(SuperListItem::getByIndex(model,modelIndex))->id())
            + "]";
        if (closure)
        {
            text += ui->plainTextMessage->textCursor().selectedText() + "[/" + tag + "]";
        }
        ui->plainTextMessage->insertPlainText(text);
        ui->plainTextMessage->setFocus();
    }
}

// -------------------------------------------------------

void WidgetComplexMessage::insertNoValueTag(QString tag)
{
    ui->plainTextMessage->insertPlainText("[" + tag + "]" + ui->plainTextMessage
        ->textCursor().selectedText() + "[/" + tag + "]");
    ui->plainTextMessage->setFocus();
}

//-------------------------------------------------

void WidgetComplexMessage::translate()
{
    ui->pushButtonIcon->setText(RPM::translate(Translations::ICON) + RPM::DOT_DOT_DOT);
    ui->comboBoxFontName->addItem(RPM::translate(Translations::FONT_NAME));
    ui->comboBoxFontSize->addItem(RPM::translate(Translations::FONT_SIZE));
    ui->comboBoxHeroName->addItem(QIcon(":/icons/Ressources/datas.png"),
        RPM::translate(Translations::HERO_NAME));
    ui->comboBoxVariable->addItem(QIcon(":/icons/Ressources/variables.png"),
        RPM::translate(Translations::VARIABLE));
    ui->comboBoxBackColor->addItem(RPM::translate(Translations::BACK_COLOR));
    ui->comboBoxTextColor->addItem(RPM::translate(Translations::TEXT_COLOR));
    ui->comboBoxParameters->addItem(QIcon(":/icons/Ressources/scripts.png"),
        RPM::translate(Translations::PARAMETER));
    ui->comboBoxProperties->addItem(QIcon(":/icons/Ressources/systems.png"),
        RPM::translate(Translations::PROPERTY));
    ui->comboBoxStrokeColor->addItem(RPM::translate(Translations::OUTLINE_COLOR));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetComplexMessage::on_pushButtonBold_clicked() {
    this->insertNoValueTag(TAG_BOLD);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_pushButtonItalic_clicked() {
    this->insertNoValueTag(TAG_ITALIC);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_pushButtonLeft_clicked() {
    this->insertNoValueTag(TAG_LEFT);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_pushButtonCenter_clicked() {
    this->insertNoValueTag(TAG_CENTER);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_pushButtonRight_clicked() {
    this->insertNoValueTag(TAG_RIGHT);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_comboBoxFontSize_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxFontSize, TAG_FONT_SIZE, RPM::get()
        ->project()->gameDatas()->systemDatas()->modelFontSizes(), index - 1);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_comboBoxFontName_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxFontName, TAG_FONT_NAME, RPM::get()
        ->project()->gameDatas()->systemDatas()->modelFontNames(), index - 1);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_comboBoxTextColor_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxTextColor, TAG_TEXT_COLOR, RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), index - 1);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_comboBoxBackColor_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxBackColor, TAG_BACK_COLOR, RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), index - 1);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_comboBoxStrokeColor_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxStrokeColor, TAG_STROKE_COLOR, RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), index - 1);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_comboBoxVariable_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxVariable, TAG_VARIABLE, reinterpret_cast
        <SystemVariables *>(RPM::get()->project()->gameDatas()->variablesDatas()
        ->model()->item((index - 1) / SystemVariables::variablesPerPage)->data()
        .value<quintptr>())->model(), (index - 1) % SystemVariables
        ::variablesPerPage, false);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_comboBoxParameters_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxParameters, TAG_PARAMETER, m_parameters,
        index - 1, false);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_comboBoxProperties_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxProperties, TAG_PROPERTY, m_properties,
        index - 1, false);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_comboBoxHeroName_currentIndexChanged(int index) {
    this->insertTag(index, ui->comboBoxHeroName, TAG_HERO_NAME, reinterpret_cast
        <SystemVariables *>(RPM::get()->project()->gameDatas()->variablesDatas()
        ->model()->item((index - 1) / SystemVariables::variablesPerPage)->data()
        .value<quintptr>())->model(), (index - 1) % SystemVariables
        ::variablesPerPage, false);
}

// -------------------------------------------------------

void WidgetComplexMessage::on_pushButtonIcon_clicked()
{
    SystemPicture pic;
    DialogPicturesPreview dialog(&pic, PictureKind::Icons);
    if (dialog.exec() == QDialog::Accepted)
    {
        ui->plainTextMessage->insertPlainText("[" + TAG_ICON + "=" + QString
            ::number(pic.id()) + ";" + QString::number(dialog.indexX())+ ";" +
            QString::number(dialog.indexY()) + "]");
    }
    ui->plainTextMessage->setFocus();
}
