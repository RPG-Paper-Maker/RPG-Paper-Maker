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

void DialogSystemFontName::initialize() {
    ui->lineEditName->setText(m_fontName.name());
    ui->panelPrimitiveFont->initializeMessageAndUpdate(m_fontName.font(), false);
}

//-------------------------------------------------

void DialogSystemFontName::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_FONT_NAME) + RPM
        ::DOT_DOT_DOT);
    ui->labelFont->setText(RPM::translate(Translations::FONT) + RPM::COLON);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
