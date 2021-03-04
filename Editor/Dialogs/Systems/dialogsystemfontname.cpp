#include "dialogsystemfontname.h"
#include "ui_dialogsystemfontname.h"
#include "rpm.h"

DialogSystemFontName::DialogSystemFontName(SystemFontName &fontName, QWidget
    *parent) :
    QDialog(parent),
    m_fontName(fontName),
    ui(new Ui::DialogSystemFontName)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemFontName::~DialogSystemFontName()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemFontName::initialize()
{
    ui->lineEditName->setText(m_fontName.name());
    if (!m_fontName.isBasic())
    {
        ui->radioButtonCustomFontID->setChecked(true);
    }
    ui->panelPrimitiveFont->initializeMessageAndUpdate(m_fontName.font(), false);
    int index = SuperListItem::getIndexById(RPM::get()->project()->fontsDatas()
        ->model()->invisibleRootItem(), m_fontName.customFontID());
    SuperListItem::fillComboBox(ui->comboBoxCustomFontID, RPM::get()->project()
        ->fontsDatas()->model());
    ui->comboBoxCustomFontID->setCurrentIndex(index);
}

//-------------------------------------------------

void DialogSystemFontName::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_FONT_NAME) + RPM
        ::DOT_DOT_DOT);
    ui->labelFont->setText(RPM::translate(Translations::FONT) + RPM::COLON);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->radioButtonBasic->setText(RPM::translate(Translations::BASIC) + RPM::COLON);
    ui->radioButtonCustomFontID->setText(RPM::translate(Translations::FONT_ID) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemFontName::on_lineEditName_textChanged(const QString &text)
{
    m_fontName.setName(text);
}

// -------------------------------------------------------

void DialogSystemFontName::on_radioButtonBasic_toggled(bool checked)
{
    m_fontName.setIsBasic(checked);
    ui->panelPrimitiveFont->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemFontName::on_radioButtonCustomFontID_toggled(bool checked)
{
    m_fontName.setIsBasic(!checked);
    ui->comboBoxCustomFontID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemFontName::on_comboBoxCustomFontID_currentIndexChanged(int index)
{
    m_fontName.setCustomFontID(SuperListItem::getIdByIndex(RPM::get()->project()
        ->fontsDatas()->model(), index));
}
